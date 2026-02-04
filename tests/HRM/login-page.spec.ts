import {test, expect} from '@playwright/test'

//B1: Break nhỏ UI ra xem có những chức năng gì
// => UI trang đăng nhập có chức năng login và dashboard HRM
//B2: Xác định test case sẽ là có những TCs gì
//B3: Xác định các step sẽ thực hiện và các step đó liên quan đến các elements nào ở trên UI và nguồn input (data test)
//đầu vào
//B4: Xác định locator của các elements
//Có thể nắm vững được 1 cách lấy locator đơn > suy nghĩ 1 hướng xa là có thể lấy locator mà áp dụng được cho nhiều ptu
//ấp dụng được cho những ptu giống nhau nhưng khác nhau về 1 số text
//tiến hành viết TCs

//list ra những locator sẽ dùng
//1. Ô input name
//xpath: //input[@id="iusername"]
//2. Ô input password
//xpath: //input[@id="ipassword"]
//3. ô login button
//xpath: //button[@type="submit"]
//4. Dialog thông báo đăng nhập thành công
//CSS: #swal2-title

//gọi là đông cứng, trạng thái debugger
setTimeout(()=> {
    debugger
}, 5000)

const LOGIN_URL = 'https://hrm.anhtester.com/erp/login'

test.describe('HRM Login Page - Positive case', () => {
    //Positive cases
    test('TC_LOGIN_01 - Đăng nhập thành công (click)', async({page}) => {
        await page.goto(LOGIN_URL)
        //webfirst assertion
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        //sử dụng expect khẳng định
        // const title = await page.locator('//h4[contains(@class,"mb-3")]').innerText()
        // expect(title).toBe('Welcome to HRM | Anh Tester Demo')

        // Thực hiện hành động login
        // Fill thông tin
        await page.locator('//input[@id="iusername"]').fill('admin_example')
        await page.locator('//input[@id="ipassword"]').fill('123456')
        await page.locator('//button[@type="submit"]').click()

        //Assert là hiển thị text Logged in successfully
        await expect(page.locator('#swal2-title')).toHaveText("Logged In Successfully.")

        //Assert là đã nhảy qua trang homepage chính xác
        //await expect(page.locator('//div[@class="page-header"]//h6')).toContainText('admin_example2 hello')
        // Assert nhảy qua trang home page có link URL là 'https://hrm.anhtester.com/erp/desk'
        await expect(page).toHaveURL('https://hrm.anhtester.com/erp/desk')
    })
    test('TC_LOGIN_02 - Đăng nhập thành công (Enter)', async({page}) =>{
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Thực hiện hành động login
        // Fill thông tin
        await page.locator('//input[@id="iusername"]').fill('admin_example')
        await page.locator('//input[@id="ipassword"]').fill('123456')
        await page.locator('//input[@id="ipassword"]').press('Enter')

        //Assert hiển thị pop-up thông báo successfully
        await expect(page.locator('#swal2-title')).toContainText('Logged In Successfully.')
        // Assert nhảy đến màn home
        await expect(page.locator('//div[@class="page-header"]//h6')).toContainText('admin_example2 hello')
    })
}
)

test.describe('HRM Login Page - Positive case', () => {
    test('TC_LOGIN_03 - Điền sai mật khẩu', async({page}) => {
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Thực hiện hành động login
        // Fill thông tin
        await page.locator('//input[@id="iusername"]').fill('admin_example')
        await page.locator('//input[@id="ipassword"]').fill('1234567')
        await page.locator('//input[@id="ipassword"]').press('Enter')

        // Kiểm tra có toast message với nội dung Invalid
        await expect(page.locator('div.toast-error div.toast-message')).toHaveText('Invalid Login Credentials.')

        //Và không chyển hướng page
        await expect(page).toHaveURL('https://hrm.anhtester.com/erp/login')
    })
    test('TC_LOGIN_04 - Sai username', async({page}) => {
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Thực hiện hành động login
        // Fill thông tin username bị sai
        await page.locator('//input[@id="iusername"]').fill('_example')
        await page.locator('//input[@id="ipassword"]').fill('1234567')
        await page.locator('//input[@id="ipassword"]').press('Enter')

        // Kiểm tra có toast message với nội dung Invalid
        await expect(page.locator('div.toast-error div.toast-message')).toHaveText('Invalid Login Credentials.')

        //Và không chyển hướng page
        await expect(page).toHaveURL('https://hrm.anhtester.com/erp/login')
    })
    test('TC_LOGIN_05 - bỏ trống cả 2 trường', async({page}) => {
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Thực hiện hành động login
        // Không fill thông tin chỉ nhấn enter ở password
        await page.locator('//input[@id="ipassword"]').press('Enter')

        // Kiểm tra có toast message với nội dung Invalid
        await expect(page.locator('div.toast-error div.toast-message')).toHaveText('The username field is required.')

        //Và không chyển hướng page
        await expect(page).toHaveURL('https://hrm.anhtester.com/erp/login')
    })
    test('TC_LOGIN_06 - Bỏ trống password', async({page}) => {
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Thực hiện hành động login
        // Bỏ trống password, điền username
        await page.locator('//input[@id="iusername"]').fill('admin_example')
        await page.locator('//input[@id="ipassword"]').press('Enter')

        // Kiểm tra có toast message với nội dung Invalid
        await expect(page.locator('div.toast-error div.toast-message')).toHaveText('The password field is required.')

        //Và không chyển hướng page
        await expect(page).toHaveURL('https://hrm.anhtester.com/erp/login')
    })
    test('TC_LOGIN_07 - Bỏ trống username', async({page}) => {
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Thực hiện hành động login
        // Bỏ trống password, điền username
        await page.locator('//input[@id="ipassword"]').fill('123456')
        await page.locator('//input[@id="ipassword"]').press('Enter')

        // Kiểm tra có toast message với nội dung Invalid
        await expect(page.locator('div.toast-error div.toast-message')).toHaveText('The username field is required.')

        //Và không chyển hướng page
        await expect(page).toHaveURL('https://hrm.anhtester.com/erp/login')
    })
    test('TC_LOGIN_08 - Điền mật khẩu quá ngắn (Dưới 6 ký tự)', async({page}) => {
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Thực hiện hành động login
        // Fill thông tin
        await page.locator('//input[@id="iusername"]').fill('admin_example')
        await page.locator('//input[@id="ipassword"]').fill('1234')
        await page.locator('//input[@id="ipassword"]').press('Enter')
        
        //Assert hiển thị toast message về mật khẩu quá ngắn
        await expect(page.locator('#toast-container div.toast-message')).toHaveText('Your password is too short, minimum 6 characters required.')

        //Và không chyển hướng page
        await expect(page).toHaveURL('https://hrm.anhtester.com/erp/login')
    })
})

test.describe('HRM Login Page - Kịch bản UI', () => {
    test('TC_LOGIN_09 - Mật khẩu bị che', async({page}) => {
        // Thực hiện hành động login
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Fill thông tin
        await page.locator('//input[@id="iusername"]').fill('admin_example')
        await page.locator('//input[@id="ipassword"]').fill('1234')

        //Check ô passwword có mật khẩu bị che thì chỉ cần check giá trị của type là password là dc
        await expect(page.locator('//input[@id="ipassword"]')).toHaveAttribute('type', 'password')
    })
    test('TC_LOGIN_10 - Nhấn vào link Quên mật khẩu', async({page}) => {
        // Thực hiện hành động login
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        //Nhấn vào link "Quên mật khẩu"
        await page.locator('//div[@class="float-right"]').click()

        // Assert nhảy qua trang quên mật khẩu
        await expect(page).toHaveURL('https://hrm.anhtester.com/erp/forgot-password')
    })

    test('TC_LOGIN_11 - Placeholder (Văn bản gợi ý)', async({page}) => {
        // Thực hiện hành động login
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Fill thông tin
        await page.locator('//input[@id="iusername"]').fill('admin_example')
        await page.locator('//input[@id="ipassword"]').fill('1234')

        //Check ô passwword có mật khẩu bị che thì chỉ cần check giá trị của type là password là dc
        await expect(page.locator('//input[@id="ipassword"]')).toHaveAttribute('placeholder', 'Enter Password')
    })
    test('TC_LOGIN_12 - Phân biệt Hoa/Thường', async({page}) => {
        // Thực hiện hành động login
        await page.goto(LOGIN_URL)
        await expect(page.locator('.mb-3.f-w-600')).toContainText('Welcome to HRM | Anh Tester Demo')

        // Fill thông tin
        await page.locator('//input[@id="iusername"]').fill('ADMIN_EXAMPLE')
        await page.locator('//input[@id="ipassword"]').fill('123456')
        await page.locator('//input[@id="ipassword"]').press('Enter')

        //Check pop-upt thông báo đăng nhập thành công
        await expect(page.locator("#swal2-title")).toHaveText('Logged In Successfully.')

        //Nhảy đến home page thành công
        await expect(page).toHaveURL('https://hrm.anhtester.com/erp/desk')
    })
})

