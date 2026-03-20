import { test, expect } from '@playwright/test';

// -----------------------------------------------------------
// VÙNG 1: TOP-LEVEL SCOPE (Code nằm ngoài cùng)
// -----------------------------------------------------------
// Dòng này sẽ chạy ngay khi file được import/load
// console.log(`[TOP-LEVEL] Đang đọc file... (PID: ${process.pid})`);

// const DATA_HEAVY = { id: 1, name: 'Big Data' };

// test.describe('Nhóm Test Demo', () => {
//   // ---------------------------------------------------------
//   // VÙNG 2: DESCRIBE SCOPE (Code nằm trong nhóm)
//   // ---------------------------------------------------------
//   // Dòng này cũng chạy ngay khi file load để đăng ký nhóm
//   console.log(`[DESCRIBE]  Đang đăng ký Group... (PID: ${process.pid})`);

//   test('Test Case A', async ({}) => {
//     // -------------------------------------------------------
//     // VÙNG 3: TEST BODY (Code nằm trong bài test)
//     // -------------------------------------------------------
//     // Dòng này CHỈ CHẠY khi trình duyệt mở
//     console.log(` [TEST BODY] Bắt đầu chạy Test A... (PID: ${process.pid})`);

//     // Chứng minh Worker có thể đọc được biến ở Top-level
//     console.log(`   -> Worker đọc dữ liệu: ${DATA_HEAVY.name}`);
//   });
// });

//const luckeyNumber = Math.floor(Math.random()*100) // Không chạy được vì đây không phải dữ liệu tĩnh
// const luckeyNumber = 5; // Chạy

// test(`Test vé số ${luckeyNumber}`, async () => {
//   console.log('Tôi trúng số rồi');
// });

// ============================================================
// 1️⃣ CHUẨN BỊ DỮ LIỆU CỨNG (STATIC DATA)
// ============================================================
// Đây chính là "Danh sách khách mời" cố định.
// Main Process và Worker Process đều nhìn thấy mảng này y hệt nhau.
const TEST_CASES = [
  {
    id: 'TC01',
    description: 'Đăng nhập thành công (Standard User)',
    username: 'standard_user',
    password: 'secret_sauce',
    shouldPass: true,
  },
  {
    id: 'TC02',
    description: 'User bị khóa (Locked Out)',
    username: 'locked_out_user',
    password: 'secret_sauce',
    shouldPass: false,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    id: 'TC03',
    description: 'Sai mật khẩu',
    username: 'standard_user',
    password: 'wrong_password',
    shouldPass: false,
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    id: 'TC04',
    description: 'Bỏ trống Username',
    username: '',
    password: 'secret_sauce',
    shouldPass: false,
    expectedError: 'Epic sadface: Username is required',
  },
];
// data provider
// []
// ============================================================
// 2️⃣ SINH TEST TỰ ĐỘNG (PARAMETERIZED)
// ============================================================
test.describe('SauceDemo Login Data-Driven', () => {
  // Vòng lặp chạy ngay khi Main Process quét file
  for (const data of TEST_CASES) {
    // Tạo tên test DUY NHẤT bằng cách ghép ID + Description
    test(`[${data.id}] ${data.description}`, async ({ page }) => {
      // --- BƯỚC 1: Truy cập trang ---
      await page.goto('https://www.saucedemo.com/');

      // --- BƯỚC 2: Điền dữ liệu (Nếu có) ---
      // Nếu data.username rỗng thì thôi không điền (để test case bỏ trống)
      if (data.username) {
        await page.locator('[data-test="username"]').fill(data.username);
      }

      if (data.password) {
        await page.locator('[data-test="password"]').fill(data.password);
      }

      // --- BƯỚC 3: Click Login ---
      await page.locator('[data-test="login-button"]').click();

      // --- BƯỚC 4: Kiểm tra kết quả (Assertion) ---
      if (data.shouldPass) {
        // ✅ Kịch bản mong đợi Thành Công
        // Check URL đổi sang trang inventory
        await expect(page).toHaveURL(/.*inventory.html/);

        // Check tiêu đề "Products" hiện ra
        await expect(page.locator('.title')).toHaveText('Products');
      } else {
        // ❌ Kịch bản mong đợi Lỗi (Negative)
        // Tìm cái thông báo lỗi màu đỏ
        const errorMsg = page.locator('[data-test="error"]');

        await expect(errorMsg).toBeVisible();
        await expect(errorMsg).toHaveText(data.expectedError!); // Dấu ! là báo TS biến này chắc chắn có
      }
    });
  }
});