import { test as setup, expect} from '@playwright/test'

setup('Setup staff', async({page, context}) => {
    await page.goto('https://coffee.autoneko.com/login');
        await page.getByPlaceholder('Nhập email hoặc tên đăng nhập').fill('tuan1');
        await page.getByPlaceholder('Nhập mật khẩu').fill('123456789');
        await page.getByRole('button', { name: 'Đăng nhập' }).click();
        await expect(page.getByRole('button', { name: 'Tiếp tục' })).toBeVisible();
        await page.getByRole('button', { name: 'Tiếp tục' }).click();

        await context.storageState({path: './auth/staff.json'})
        console.log('[Setup] Staff đăng nhập thành công');
})