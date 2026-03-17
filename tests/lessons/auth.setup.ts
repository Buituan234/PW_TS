import { test as setup, expect } from '@playwright/test';

setup('Tạo User và Login', async ({ page }) => {
  console.log('🟢 [SETUP] 1. Đang tạo User mới trong Database...');
  // Giả lập gọi API tạo user...

  console.log('🟢 [SETUP] 2. Đang thực hiện Login...');
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  // Kiểm tra login thành công
  await expect(page).toHaveURL(/inventory/);

  // Lưu lại trạng thái Login (Cookies)
  await page.context().storageState({ path: './auth/user.json' });
  console.log('🟢 [SETUP] ✅ Đã lưu cookie vào user.json');
});