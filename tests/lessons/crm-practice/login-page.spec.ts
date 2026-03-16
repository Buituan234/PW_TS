import { test, expect } from '@playwright/test';

//B1: Break nhỏ UI ra xem có chức năng gì
// => UI trang đăng nhập có chức năng login vào dashboard HRM
//B2: xác định test case sẽ là có những TCs gì.
//B3: Xác định các step sẽ thực hiện và các step đó liên quan đến các elements nào ở trên UI và nguồn input (data test) đầu vào là gì?
//B4: xác định locator của các elements
// có thể nắm vững đc 1 cách lấy locator đơn -> suy nghĩ 1 hướng xa ra là có thể lấy locator mà áp dụng được cho nhiều phần tử khác nhau
//áp dụng được cho những phần tử giống nhau nhưng khác nhau về 1 số text chẳng hạn
//
// tiến hành viết TCS

//list ra nhung locator se dung
// 1 la o input name. 2 la o input password. 3 la login button

// PD ok => xpath
//input[@id='iusername']
//input[@id='ipassword']
//button[@type='submit']

// Huong Le OK => theo getbyrole
//1. input username   .getByRole('textbox', {name: 'Your Username'})
//2. input pass   .getByRole('textbox', {name: 'Enter Password'})
//3. button login   .getByRole('button', {name: 'Login'})

//css
// inputusername: #iusername
//inputpassword: #ipassword
//button[type='submit']
//goi la donfg cung nhung ban chat la vao trang thai debugger
// setTimeout(() => {
//   debugger;
// }, 5000);

//lay locator cua modal the hien viec ma Logged In Successfully."

//ngoc hoa
// page.locator('#swal2-title')
// ok
// await expect(page.locator('h4.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')
//h4(contains[@class, 'mb-3 f-w-600'])
//  page.getByRole('heading', { level: 4 });
//lay title de assert la vao web thanh cong

//tim locator Invalid Login Credentials (toast message)
// .toast.toast-error .toast-message -> thu hep pham vi tim kiem
// .toast-message
const LOGIN_URL = 'https://hrm.anhtester.com/erp/login';

test.describe('HRML Login Page - Possitive case', () => {
  //Positive cases
  test('TC_LOGIN_01 - Đăng nhập thành công (Click)', async ({ page }) => {
    await page.goto(LOGIN_URL);
    //webfirst assertion
    await expect(page.locator('h4.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo');

    //dang su dung expect khang dinh
    // const title = await page.locator('h4').innerText();
    // expect(title).toBe('Welcome to HRM | Anh Tester Demo');
    //thuc hien hanh dong login
    //fill

    //assert la hien thi text Logged In Successfully.
    // await page.locator('#iusername').fill('admin_example');
    // await page.locator('#ipassword').fill('123456');
    // await page.getByRole('button', { name: 'Login' }).click();

    //
    await page.locator('#iusername').fill('admin_example');
    await page.locator('#ipassword').fill('123456');
    await page.locator("//button[@type='submit']").click();

    // 1. Kiểm tra modal/toast có text "Logged In Successfully." xuất hiện.
    await expect(page.locator('#swal2-title')).toHaveText('Logged In Successfully.');
    // 2. Kiểm tra URL của trang đã chuyển hướng (chứa /erp/desk)
    await expect(page).toHaveURL('https://hrm.anhtester.com/erp/desk');
    await expect(page).toHaveURL(/erp\/desk/);
    await expect(page).toHaveURL(/.*\/erp\/desk.*/);
  });

  test('TC_LOGIN_02 - Đăng nhập thành công (Enter)', async ({ page }) => {
    await page.goto(LOGIN_URL);
    //webfirst assertion
    await expect(page.locator('h4.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo');

    await page.locator('#iusername').fill('admin_example');
    await page.locator('#ipassword').fill('123456');
    //OK
    await page.locator('#ipassword').press('Enter');

    // 1. Kiểm tra modal/toast có text "Logged In Successfully." xuất hiện.
    await expect(page.locator('#swal2-title')).toHaveText('Logged In Successfully.');
    // 2. Kiểm tra URL của trang đã chuyển hướng (chứa /erp/desk)
    await expect(page).toHaveURL('https://hrm.anhtester.com/erp/desk');
    await expect(page).toHaveURL(/erp\/desk/);
    await expect(page).toHaveURL(/.*\/erp\/desk.*/);
  });
});

test.describe('HRML Login Page - Negative case', () => {
  test('TC_LOGIN_03 - Sai Mật khẩu', async ({ page }) => {
    await page.goto(LOGIN_URL);
    //webfirst assertion
    await expect(page.locator('h4.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo');

    //action
    await page.locator('#iusername').fill('admin_example');
    await page.locator('#ipassword').fill('3223423');
    await page.locator("//button[@type='submit']").click();
    //expect co toast message co chua text Invalid Login Credentials
    await expect(page.locator('.toast-message')).toContainText('Invalid Login Credentials');
    // .toast-message
  });
  //BTVN TC4->TC7
  //cach viet testcase theo chuan AAA - TDD
  test('TC_LOGIN_08 - Mật khẩu quá ngắn (dưới 6 ký tự)', async ({ page }) => {
    // Arrange
    await page.goto('https://hrm.anhtester.com/erp/login');
    const title = page.locator('h4');
    await expect(title).toHaveText('Welcome to HRM | Anh Tester Demo');

    //Actions
    await page.locator('#iusername').fill('admin_example');
    await page.locator('#ipassword').fill('12345');
    await page.keyboard.press('Enter');

    //Assert
    await expect(page.locator('.toast-message')).toContainText(
      'Your password is too short, minimum 6 characters required.'
    );
  });
});

test.describe('HRML Login Page - UI', () => {
  test('TC_LOGIN_09 - Mật khẩu bị che (Masking)', async ({ page }) => {
    await page.goto(LOGIN_URL);
    //webfirst assertion
    await expect(page.locator('h4.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo');
    // Kiểm tra ô Password có thuộc tính(attribute) type là password.
    //nhận vào 2 đối số. 1 là tên attribute, 2 là giá trị so sánh của attribute
    // await expect(page.locator('#avatar')).toHaveAttribute('alt', 'User Avatar')
    // =>ok
    await expect(page.locator('#ipassword')).toHaveAttribute('type', 'password');
  });
  //   TC10 -> TC13 là BTVN
  test('TC_LOGIN_11 - Placeholder (Văn bản gợi ý)', async ({ page }) => {
    await page.goto(LOGIN_URL);
    //webfirst assertion
    await expect(page.locator('h4.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo');

    //có 2 cách. 1 là làm giống TC9
    //2 là get attribute của 2 ô input và so sánh với yêu cầu của đề bài
    await expect(page.locator('#iusername')).toHaveAttribute('placeholder', 'Your Username');
    await expect(page.locator('#ipassword')).toHaveAttribute('placeholder', 'Enter Password');
    // là page.locator().getAttribute('tên của attribute')
    const userNamePlaceHolder = page.locator('#iusername');
    await expect(userNamePlaceHolder).toHaveAttribute('placeholder', 'Your Username');

    const passwordPlaceHolder = page.locator('#ipassword');
    await expect(passwordPlaceHolder).toHaveAttribute('placeholder', 'Enter Password');
  });
});