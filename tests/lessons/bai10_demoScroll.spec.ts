import { test, expect } from '@playwright/test'
test('TC01: full combo, API + UI', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app');

    await page.getByRole('link', { name: 'Bài 5: Shadow DOM & iFrame' }).click();

    await page.getByText('♾️ Infinite Scroll', { exact: true }).click();

    const panel = page.getByRole('tabpanel', { name: '♾️ Infinite Scroll' });
    const container = panel.locator('#mouse-position-demo')

    //Hover vào tâm
    await container.hover()

    //Hover vào góc trên bên trái
    await container.hover({position: {x: 0, y: 0}})

    //Hover vào góc dưới bên phải
    const sizeContainer = await container.boundingBox()
    if (!sizeContainer){
        throw new Error('Container không có kích thước')
    }
    await container.hover({position: {x: sizeContainer?.width-5, y: sizeContainer?.height-5}})
    await page.pause()
})