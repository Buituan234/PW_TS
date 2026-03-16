import {test ,chromium} from '@playwright/test'

test('Khởi nguyên, tự tay khởi động trình duyệt', async()=> {
    console.log('B1: launch browser - xây nhà');
    // Quyết định hình của trình duyệt
    const browser = await chromium.launch({
        headless: false,
        slowMo: 2000,
        channel: 'chrome',
    })
    console.log('Bước 2: new context (Mở phòng)');
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720},
        recordVideo: { dir: 'video/'},
    })
    
    console.log(`Bước 3: New page (Mở tab)`);

    const page = await context.newPage()

    //Thao tác
    await page.goto('https://crm.anhtester.com/admin/authentication')
    await page.locator('#email').fill('admini@example.com')

    // Bước quan trọng
    // Memory leak
    await browser.close()
})