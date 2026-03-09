import { test as base, Page } from '@playwright/test';

import { CRMLoginPage } from '../pom/CRMLoginPage';

// 1. MENU CỔNG AN NINH

export type AuthFixtures = {
  loginPage: CRMLoginPage; // Trang Login (Chưa đăng nhập)

  authedPage: Page; // Trang Đã Đăng Nhập (Quan trọng!)
};

// 2. LOGIC

export const auth = base.extend<AuthFixtures>({
  // --- TẦNG 1: Trang Login thuần túy ---

  loginPage: async ({ page }, use) => {
    const loginPage = new CRMLoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  // --- TẦNG 2: GATEKEEPER (Người Gác Cổng) ---

  // Fixture này nhận vào 'loginPage' và trả về 'page' đã login

  authedPage: async ({ loginPage, page, storageState }, use) => {
    const isGuestMode = typeof storageState === 'object' && storageState.cookies?.length === 0;

    if (isGuestMode) {
      console.log('⚠️ Token hết hạn. Đang đăng nhập lại...');
      await loginPage.goto();
      await loginPage.login('admin@example.com', '123456');
      await loginPage.expectLoggedIn(); // Không làm gì cả, cứ thế đưa page cho dùng
    }
    // TRẢ VỀ PAGE CHO BÀI TEST
    await use(page);
  },
});