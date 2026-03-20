import { test, expect } from '@playwright/test';

test('Demo Trace on-first-retry: Fail lần 1, Pass lần 2', async ({ page }, testInfo) => {
  // --- GIAI ĐOẠN 1: TRUY CẬP ---
  await page.goto('/admin/authentication');
  await expect(page).toHaveTitle(/Login/);

  // --- GIAI ĐOẠN 2: GÀI BẪY (CỐ TÌNH FAIL) ---
  console.log(`🔄 Đang chạy lần thứ: ${testInfo.retry + 1} (Retry index: ${testInfo.retry})`);

  if (testInfo.retry === 0) {
    console.log('🔥 [Lần 1] Phát hiện chạy lần đầu -> Ép cho Fail để kích hoạt Retry!');

    // Cố tình expect sai để test fail ngay lập tức
    // Lần này Playwright sẽ KHÔNG lưu Trace (do config on-first-retry)
    expect(true, 'Cố tình fail lần 1').toBe(false);
  }

  // --- GIAI ĐOẠN 3: LOGIC CHÍNH (CHỈ CHẠY KHI RETRY) ---
  console.log('✅ [Lần 2] Đây là lần Retry -> Code sẽ chạy mượt mà và LƯU TRACE.');

  await page.locator('input[name="email"]').fill('admin@example.com');
  await page.locator('input[name="password"]').fill('123456');
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL('/admin/');
});