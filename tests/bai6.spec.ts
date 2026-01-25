import { test, expect } from '@playwright/test';

const DEMO_URL = 'https://demoapp-sable-gamma.vercel.app'

test('Ví dụ về điều kiện không thể click', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()

    await page.locator('//span[text()="Bắt Đầu Animation"]').click()
    await page.getByText('✅ Click Tôi! (Đã dừng)').click()
});

test('Ví dụ các loại click trong PW', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()

    await page.locator('//span[text()="Click Me"]').click()

    await page.locator('//span[text()="Double Click Me"]').dblclick()

    await page.locator('//span[text()="Right Click Me"]').click({button: 'right'})

    setTimeout(()=> {
        debugger
    }, 3000)
});

//Hàm để hỗ trợ dừng UI để debug
// setTimeout(()=> {
//         debugger
//     }, 3000)

test('Test hover trong PW', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()

    await page.locator('//span[text()="Click Me"]').click()

    await page.locator('//div[text()="Hover để xem tooltip"]').nth(0).hover()

    const toolTip = await page.locator('.ant-tooltip-inner').innerText()
    console.log(toolTip);

    await expect(page.getByRole('tooltip')).toBeVisible()

    await page.pause()
    
});

