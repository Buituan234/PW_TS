import {test, expect} from '@playwright/test'

test('Test sử dụng browsercontext', async({ browser}) => {
    console.log('Khởi tạo phòng 201');
    // Phòng 201
    const adminContext = await browser.newContext({
        viewport: { width: 1280, height: 720},
        recordVideo: {dir: 'videos/admin'}
    });

    // Mở tab làm việc
    const adminPage = await adminContext.newPage()

    await test.step('Phòng 201 biết chuyện phòng 201', async() => {
        console.log('Adnin đăng nhập thành công');
        await adminPage.goto('https://crm.anhtester.com/admin/authentication')
        await adminPage.locator('#email').fill('admin@example.com')
        await adminPage.locator('#password').fill('123456')
        await adminPage.getByRole('button', {name: 'Login'}).click()
        await adminPage.waitForURL(/.*admin\//)
        console.log('Admin đã vào phòng 201');
        
    })

    // Lấy chìa khóa phòng
    const secretDashboardURL = adminPage.url()

    // Phòng 202 muốn hack vào phòng 201
    const hackerContext = await browser.newContext({
        viewport: {width: 375, height: 660},
        recordVideo: { dir: 'videos/dotnhap/'}
    })
    const hackerPage = await hackerContext.newPage()
    await test.step('hacker phòng 202 cố tình truy cập link mật', async() => {
        // Link trang dashboard
        await hackerPage.goto(secretDashboardURL)
    })
    // expect(adminPage.url).toContain('admin')

    await adminPage.pause()
    await hackerPage.pause()
})

const contractURL = 'https://crm.anhtester.com/contract/65/ec79760f1ac5e966a9abee90e07f64de'
test('Demo admin chat guest', async({ browser}) => {
    console.log('Khởi tạo phòng 201');
    // Phòng 201
    const adminContext = await browser.newContext({
        viewport: { width: 1280, height: 720},
        recordVideo: {dir: 'videos/admin'}
    });

    // Mở tab làm việc
    const adminPage = await adminContext.newPage()

    await test.step('Phòng 201 biết chuyện phòng 201', async() => {
        console.log('Adnin đăng nhập thành công');
        await adminPage.goto('https://crm.anhtester.com/admin/authentication')
        await adminPage.locator('#email').fill('admin@example.com')
        await adminPage.locator('#password').fill('123456')
        await adminPage.getByRole('button', {name: 'Login'}).click()
        await adminPage.waitForURL(/.*admin\//)
        console.log('Admin đã vào phòng 201');
        
    })

    // Lấy chìa khóa phòng
    const secretDashboardURL = adminPage.url()

    // Phòng 202 muốn hack vào phòng 201
    const hackerContext = await browser.newContext({
        viewport: {width: 375, height: 660},
        recordVideo: { dir: 'videos/dotnhap/'}
    })
    const hackerPage = await hackerContext.newPage()
    await test.step('hacker phòng 202 cố tình truy cập link mật', async() => {
        // Link trang dashboard
        await hackerPage.goto(secretDashboardURL)
    })
    // expect(adminPage.url).toContain('admin')

    await adminPage.pause()
    await hackerPage.pause()
})