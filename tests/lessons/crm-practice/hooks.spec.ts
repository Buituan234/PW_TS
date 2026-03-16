import { test, expect, Page, chromium } from '@playwright/test';

// rất hay dùng của các bạn hay xài selenium

// Khai báo biến toàn cục
// let page: Page;

// test.beforeAll(async () => {
//   console.log(`[Before] Khởi động DB...`);
// });

// test.beforeEach(async ({ browser }) => {
//   console.log(`[Before each] mở trang mới`);
//   const context = await browser.newContext();
//   page = await context.newPage();
//   await page.goto(process.env.BASE_URL!);
// });

// test('TC01. Login', async () => {
//   console.log(`[TC01] Dang chay`);
//   await expect(page).toHaveTitle('Please login');
// });

// test('TC02. Check footer', async () => {
//   console.log(`[TC02] Dang chay`);
//   await expect(page.locator('h1')).toBeVisible();
// });

// test.afterEach(async () => {
//   console.log(`[after each] don dep`);
//   await page.close();
// });

// test.afterAll(async () => {
//   console.log(`[after all] ngat ket noi db`);
// });

// test.describe.configure({ mode: 'serial' });

// let sharedPage: Page;

// test.beforeAll(async () => {
//   const browser = await chromium.launch();
//   //tao context
//   const context = await browser.newContext();
//   sharedPage = await context.newPage();
// });

// test.beforeEach(async () => {
//   //thay vi tao moi ta dung laibien shared page

//   await sharedPage.goto('https://example.com');
// });

// test('Test1: User bat che do darkmode', async () => {
//   await sharedPage.evaluate(() => {
//     localStorage.setItem('theme', 'dark');
//   });
//   const theme = await sharedPage.evaluate(() => localStorage.getItem('theme'));

//   expect(theme).toBe('dark');
// });

// test('Test2: User moi vao mong doi che do sang', async () => {
//   const theme = await sharedPage.evaluate(() => localStorage.getItem('theme'));
//   expect(theme).toBeNull();
// });


// Ví dụ 2
let sharedPage: Page;

//BAD PRACTICE
test.beforeAll(async () => {
  const browser = await chromium.launch();
  //tao context
  const context = await browser.newContext();
  sharedPage = await context.newPage();
  await sharedPage.goto(process.env.BASE_URL!);
});

test('TC01. Login', async () => {
  console.log(`[TC01] Dang chay`);
  await expect(sharedPage).toHaveTitle('Please login');
});

test('TC02. Check footer', async () => {
  console.log(`[TC02] Dang chay`);
  await expect(sharedPage.locator('h1')).toBeVisible();
});

//FIXTURE -
//giống beforeEach -> nó tự động tạo page mới cho mỗi bài test(sạch sẽ)

//ko cần ko càn let hay biến global . Page đc truyền thẳng vào hàm test{{page}}