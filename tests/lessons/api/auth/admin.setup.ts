import { test as setup, expect} from '@playwright/test'

setup('Setup admin', async({page, context}) => {
    await page.goto('https://coffee.autoneko.com/login');
        await page.getByPlaceholder('Nhập email hoặc tên đăng nhập').fill('admin');
        await page.getByPlaceholder('Nhập mật khẩu').fill('Admin@123');
        await page.getByRole('button', { name: 'Đăng nhập' }).click();
        await expect(page.getByRole('button', { name: 'Tiếp tục' })).toBeVisible();
        await page.getByRole('button', { name: 'Tiếp tục' }).click();

        await context.storageState({path: './auth/staff.setup.json'})
        console.log('[Setup] Admin đăng nhập thành công');
})