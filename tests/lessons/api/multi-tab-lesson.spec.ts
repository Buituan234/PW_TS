import { TIMEOUT } from 'dns';
import { loadFromFolder } from './file-upload.util';
import { test, expect } from './fixtures/gatekeeper.api.fixture';
import { TabManager } from './tab-manager';

test.describe('Bài học - Multiple với tabmanager', () => {
    test('TC01. Quản lý tab bằng tabmanager', async ({ page, context }) => {
        test.setTimeout(12000)
        // Đầu tiên khởi tạo manager và đăng ký tab đầu tiên
        const tabs = new TabManager()
        tabs.add('main', page)

        //B1: Đăng nhập bằng UI
        await page.goto('https://coffee.autoneko.com/login');
        await page.getByPlaceholder('Nhập email hoặc tên đăng nhập').fill('admin');
        await page.getByPlaceholder('Nhập mật khẩu').fill('Admin@123');
        await page.getByRole('button', { name: 'Đăng nhập' }).click();
        await expect(page.getByRole('button', { name: 'Tiếp tục' })).toBeVisible();
        await page.getByRole('button', { name: 'Tiếp tục' }).click();

        //B2: Vào detail
        await page.goto('https://coffee.autoneko.com/admin/orders/102')
        const h1Title = await page.locator('h1').textContent()
        expect(h1Title).toBeTruthy()
        tabs.status()

        const invoiceBtn = page.locator('a[href*="/admin/orders/102/invoice"]')
        const [invoicePage] = await Promise.all([
            context.waitForEvent('page'), invoiceBtn.click()
        ])

        tabs.add('invoice', invoicePage)
        await invoicePage.waitForLoadState('domcontentloaded')

        await tabs.switchTo('main')
        console.log(`Đang ở ${tabs.currentName} (${tabs.current?.url()})`);

        await tabs.switchTo('invoice')
        console.log(`Đang ở ${tabs.currentName} (${tabs.current?.url()})`);

        const invPage = tabs.get('invoice')

        if (invPage){
            const hasH1 = await invPage.locator('h1').textContent()
            console.log(hasH1);
        }

        await tabs.close('invoice')

        await tabs.switchTo('main')

        tabs.status()
        await page.pause()
    }),
    test('TC02. Quản lý popup bằng tabmanager', async ({ page, context }) => {
        test.setTimeout(40000)
        // Đầu tiên khởi tạo manager và đăng ký tab đầu tiên
        const tabs = new TabManager()
        tabs.add('main', page)

        //B1: Đăng nhập bằng UI
        await page.goto('https://coffee.autoneko.com/login');
        await page.getByPlaceholder('Nhập email hoặc tên đăng nhập').fill('admin');
        await page.getByPlaceholder('Nhập mật khẩu').fill('Admin@123');
        await page.getByRole('button', { name: 'Đăng nhập' }).click();
        await expect(page.getByRole('button', { name: 'Tiếp tục' })).toBeVisible();
        await page.getByRole('button', { name: 'Tiếp tục' }).click();

        //B2: Vào detail
        await page.goto('https://coffee.autoneko.com/admin/orders/102')
        const h1Title = await page.locator('h1').textContent()
        expect(h1Title).toBeTruthy()
        tabs.status()

        const invoiceBtn = page.locator('a[href*="/admin/orders/102/invoice"]')
        const [invoicePage] = await Promise.all([
            context.waitForEvent('page'), invoiceBtn.click()
        ])

        tabs.add('invoice', invoicePage)
        await invoicePage.waitForLoadState('domcontentloaded')
        tabs.status()
        await tabs.switchTo('invoice')

        const popupPage = tabs.get('invoice')

        const openWinBtn = popupPage?.locator('//button', {hasText: "Cửa sổ mới"})
        const [popup] = await Promise.all([
            popupPage?.waitForEvent('popup'), openWinBtn?.click()
        ])

        tabs.add('invoice_popup', popup!)
        await tabs.switchTo('invoice_popup')
        tabs.status()

        console.log(`Tab hiện tại là ${tabs.currentName}`);

        tabs.close('invoice_popup')

        await tabs.switchTo('invoice')
        tabs.status()
        // await page.pause()
    })
})