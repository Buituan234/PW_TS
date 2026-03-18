// import { test, expect } from '@playwright/test'
// import { CRMLoginPage } from './pom/CRMLoginPage'
// import { CRMDashboardPage } from './pom/CRMDashboardPage'

// test('CRM Login page - login thành công', async ({ page }) => {
//     // AAA
//     // Arrange: Khởi tạo điều khiện cần thiết (Ở đây là tìm được đến trang đăng nhập)
//     const loginPage = new CRMLoginPage(page)
//     const dashboardPage = new CRMDashboardPage(page)

//     await loginPage.goto()
//     await loginPage.expectOnPage()

//     //Action: Thực hiện các hành động
//     await loginPage.login('admin@example.com', '123456')

//     //Assert: Kết quả mong muốn
//     await dashboardPage.expectOnPage()
// })


import { test, expect } from './fixture/gatekeeper.fixture';
// Import Helper và Data Catalog từ file index
import { testDataCatalog, getTestDataSimple } from './test-data';

// Reset storage để đảm bảo mỗi test chạy sạch sẽ
test.use({ storageState: { cookies: [], origins: [] } });

// ============================================================
// 🔍 GIAI ĐOẠN 1: PARSE & PLAN (Main & Worker cùng chạy)
// ============================================================
// Giai đoạn này chạy siêu nhanh, chỉ xử lý logic trên RAM để chia nhóm test

console.log(`📦 [PARSE] Loading keys from testDataCatalog... (PID: ${process.pid})`);
// loginCases là 1 OBJECT (không phải array), dạng:
// {
//   validLogin:    { description: "...", data: { email: "...", expectedResult: "success" } },
//   emptyEmail:    { description: "...", data: { email: "",    expectedResult: "error" } },
//   wrongPassword: { description: "...", data: { email: "...", expectedResult: "error" } },
//   ...
// }
const loginCases = testDataCatalog.loginCases;

// typeof loginCases → kiểu của object ở trên
// keyof typeof loginCases → 'validLogin' | 'emptyEmail' | 'wrongPassword' | ...
// → Đây là UNION TYPE của tất cả tên keys
type LoginCaseKey = keyof typeof loginCases;

// Object.keys(loginCases) trả về ARRAY tên keys:
// ['validLogin', 'emptyEmail', 'wrongPassword', ...]
// Nhưng TypeScript chỉ biết nó là string[] (quá chung)
// → Cast "as LoginCaseKey[]" để TypeScript biết đúng kiểu
const allKeys = Object.keys(loginCases) as LoginCaseKey[];

// allKeys.filter() — lọc array, giữ lại elements thỏa điều kiện
// loginCases[key] — truy cập object bằng key (giống loginCases.validLogin)
// .data.expectedResult — đi sâu vào field trong entry
//
// Ví dụ với key = 'validLogin':
//   loginCases['validLogin'].data.expectedResult → 'success' → GIỮ LẠI
// Ví dụ với key = 'emptyEmail':
//   loginCases['emptyEmail'].data.expectedResult → 'error'   → BỎ QUA
const positiveKeys = allKeys.filter((key) => loginCases[key].data.expectedResult === 'success');
const negativeKeys = allKeys.filter((key) => loginCases[key].data.expectedResult === 'error');

console.log(`   👉 Found ${positiveKeys.length} positive cases.`);
console.log(`   👉 Found ${negativeKeys.length} negative cases.`);

// ============================================================
// 🧪 GIAI ĐOẠN 2: TEST GENERATION (Main ghi danh)
// ============================================================

// --- GROUP 1: POSITIVE CASES (@smoke) ---
test.describe('Login - Positive Cases', { tag: '@smoke' }, () => {
  for (const key of positiveKeys) {
    // Lấy description để đặt tên Test (parse-time, chỉ đọc metadata)
    const { description } = loginCases[key];

    test(`${key}: ${description}`, async ({ page }) => {
      // Clone data mới tinh cho mỗi test run
      const data = getTestDataSimple('loginCases', key);

      console.log(`▶️ Running Positive Case: ${key}`);

      await page.goto('/admin/authentication');
      await page.locator('#email').fill(data.email);
      await page.locator('#password').fill(data.password);
      await page.getByRole('button', { name: 'Login' }).click();

      // Verify redirect (Ép kiểu nhẹ vì ta biết chắc chắn đây là success case)
      await expect(page).toHaveURL(new RegExp(data.expectedUrl));
    });
  }
});

// --- GROUP 2: NEGATIVE CASES (@regression) ---
test.describe('Login - Negative Cases', { tag: '@regression' }, () => {
  for (const key of negativeKeys) {
    // Lấy description để đặt tên Test (parse-time, chỉ đọc metadata)
    const { description } = loginCases[key];

    test(`${key}: ${description}`, async ({ loginPage, page }) => {
      // Clone data mới tinh cho mỗi test run
      const data = getTestDataSimple('loginCases', key);

      console.log(`▶️ Running Negative Case: ${key}`);

      await loginPage.expectOnPage();
      const emailInput = page.locator('#email');
      const passwordInput = page.locator('#password');

      // Xử lý điền dữ liệu (có thể rỗng)
      await emailInput.fill(data.email);
      await passwordInput.fill(data.password);
      await page.getByRole('button', { name: 'Login' }).click();

      // --- LOGIC CHECK LỖI ---
      const validationType = data.validationType;
      const expectedError = data.expectedError;

      if (validationType === 'browser') {
        // Case 1: Browser Validation (HTML5 Bubble)

        // Check 1: Input phải ở trạng thái invalid
        const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
        expect(isInvalid).toBe(true);

        // Check 2: Message trình duyệt
        const validationMessage = await emailInput.evaluate(
          (el: HTMLInputElement) => el.validationMessage
        );
        // Lưu ý: Message trình duyệt phụ thuộc ngôn ngữ OS, nên dùng toContain cho an toàn
        expect(validationMessage).toContain(expectedError);
      } else {
        // Case 2: Server Validation (Alert Box)
        // Locator này tùy dự án, ví dụ check alert chung
        const alertBox = page.locator('.alert-danger, .alert-warning, div[role="alert"]');
        await expect(alertBox).toBeVisible();
        await expect(alertBox).toContainText(expectedError);
      }

      // Verify vẫn đứng yên ở trang login
      await expect(page).toHaveURL(/authentication/);
    });
  }
});