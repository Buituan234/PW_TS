import { test, expect } from '@playwright/test';
// 👇 Thư viện "thần thánh" giúp report xịn xò
import * as allure from "allure-js-commons"; 

test('Login Negative Case: Sai Password', async ({ page }) => {
  
  // 1️⃣ METADATA (Trang điểm cho bài test)
  await allure.epic("Authentication Module");
  await allure.feature("Login Feature");
  await allure.story("Login với mật khẩu sai");
  await allure.severity("critical");
  await allure.owner("Anh Tester");
  await allure.description("Kiểm tra hệ thống ngăn chặn đăng nhập khi sai pass.");

  // Dữ liệu test
  const testData = {
    email: "admin@example.com",
    password: "wrong_password_123"
  };

  // 2️⃣ STEP 1: Truy cập và Chụp ảnh bằng chứng
  // Sử dụng allure.step để bọc code lại
  await allure.step("Bước 1: Truy cập trang Login", async () => {
    await page.goto('https://crm.anhtester.com/admin/authentication');
    await expect(page).toHaveTitle(/Login/);

    // 📸 KỸ THUẬT: Đính kèm ảnh chụp màn hình vào NGAY BƯỚC NÀY
    const screenshot = await page.screenshot();
    await allure.attachment("Ảnh màn hình trang Login", screenshot, "image/png");
  });

  // 3️⃣ STEP 2: Điền form (Có Log Parameter)
  // stepContext giúp ta thêm tham số vào báo cáo
  await allure.step("Bước 2: Điền thông tin đăng nhập", async (stepContext) => {
    
    // 📝 KỸ THUẬT: Log lại dữ liệu đã nhập (Parameters)
    // Giúp người đọc báo cáo biết ta đã nhập cái gì mà không cần đoán
    await stepContext.parameter("Email Input", testData.email);
    await stepContext.parameter("Password Input", "******"); // Che mật khẩu thật

    await page.locator('input[name="email"]').fill(testData.email);
    await page.locator('input[name="password"]').fill(testData.password);
    
    // Chụp ảnh form sau khi điền
    await allure.attachment("Form sau khi điền", await page.screenshot(), "image/png");
  });

  // 4️⃣ STEP 3: Submit và Kiểm tra lỗi
  await allure.step("Bước 3: Click Login và Check lỗi", async () => {
    await page.locator('button[type="submit"]').click();

    // Verify thông báo lỗi hiện ra
    const alertLocator = page.locator('div.alert-danger'); // Ví dụ locator
    await expect(alertLocator).toBeVisible();
    
    // Đính kèm text nội dung lỗi lấy được
    const textContent = await alertLocator.textContent();
    await allure.attachment("Nội dung thông báo lỗi", textContent || "No text", "text/plain");
  });

});