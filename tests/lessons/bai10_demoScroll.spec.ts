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
test('TC02: Demo Infinite scroll', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app');

    await page.getByRole('link', { name: 'Bài 5: Shadow DOM & iFrame' }).click();

    await page.getByText('♾️ Infinite Scroll', { exact: true }).click();

    const panel = page.getByRole('tabpanel', { name: '♾️ Infinite Scroll' });
    const container = panel.locator('#infinite-scroll-container')
    const targetItem = container.locator('#item80')

    //Hover vào tâm
    await container.hover()

    for (let i = 0; i < 20; i++){
        try {
            await expect(targetItem).toBeInViewport({timeout: 500})
            break
        }
        catch {
            await page.mouse.wheel(0,400)

            // Dùng cho cuộn ngang
            // await page.mouse.wheel(400, 0)
        }
    }
    // Cần dùng thêm scrollIntoViewIfNeeded để tránh trường hợp đa cuộn thấy item rồi
    // Nhưng item kiểu dạng lấp ló không thể click hay tác động lên được thì cần scroll để tác động
    // Tại sao có scrollIntoViewIfNeeded rồi mà vẫn cần wheel ?
    // Bởi vì hàm này chỉ có tác động đến các item đã hiển thị trên DOM vì đây là infinite scroll thì
    // càng load xuống thì mới hiển thị thêm nên sẽ ko có sẵn item 80
    await targetItem.scrollIntoViewIfNeeded()
    await expect(targetItem).toBeVisible()
})