import { auth, AuthFixtures } from './auth.fixture';

// Import danh sách phòng ban

import { appFixtures, AppFixtures } from './app.fixture';

// 1. TỔNG HỢP MENU

// Menu Tổng = Menu Auth + Menu App

export type GatekeeperFixtures = AuthFixtures & AppFixtures;

// 2. NÂNG CẤP ROBOT

// Lấy con Robot 'auth' -> Dạy thêm các món trong 'appFixtures'

export const test = auth.extend<AppFixtures>({
  ...appFixtures,
});

// Xuất khẩu 'expect' để dùng tiện luôn

export { expect } from '@playwright/test';