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

    await page.locator('//span[text()="Right Click Me"]').click({ button: 'right' })

    setTimeout(() => {
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

// Thẻ span không có event listner hay thuộc tính disable nên vẫn có thể click được khi disable

test('Click element thật/giả', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()

    //Nên lấy button thật với thẻ span bên trong
    await page.locator('//button[contains(.,"Disable Button")]').click()

    //Click Me(span)
    await page.locator('//span[text()="Click Me (span)"]').click()

    //Click Me button
    await page.locator('//button[contains(.,"Click Me (button)")]').click()

    await page.pause()

});

//<div style="padding: 8px 16px; background-color: rgb(24, 144, 255); color: white; border-radius: 4px; cursor: pointer; user-select: none; display: flex; align-items: center; gap: 8px;">
// <span>Custom Button (Div + Span)</span>
// </div>
//Cơ chế trình duyệt có cái gọi là event bobbling: Cơ chế nổi bọt, nếu mà ấn vào thẻ span(thẻ bên trong) mà không thể click được thì nó sẽ truy lên những thẻ bên ngoài (Ở đây là div)
// có cơ chế click > nen là khi click vào thẻ span thì vẫn kích hoạt được cơ chế vào thẻ div bên ngoài

test('Click nhiều button', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()

    const files = [
        '📄 Document.pdf',
        '🖼️ Image.jpg ',
        '📊 Report.xlsx ',
        '🎵 Music.mp3 ',
        '📹 Video.mp4 '
    ]
    // chỉ có for cổ điển hoặc for of thì mới có thể sử dụng await trong thân hàm > for each không thể dùng await
    for (const f of files) {
        await page.getByRole('button', { name: f }).click();
    }
    await expect(page.locator('#ac-selected-count-advanced')).toContainText('Selected: 5 items')
    await page.locator('#ac-process').click()

    const successMessage = page.locator('.ant-space-item .ant-alert-message')
    const successMessageResult = await successMessage.innerText()
    expect(successMessageResult).toEqual('Processing Complete!')

    await page.pause()

});

test('Keyboard actions', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '⌨️ Keyboard Actions' }).click()

    // // Nhấn phím Enter
    // await page.locator('input').press('Enter');

    // // Nhấn phím Delete
    // await page.locator('input').press('Delete');

    // // Nhấn phím Arrow
    // await page.locator('input').press('ArrowUp');
    // await page.locator('input').press('ArrowDown');
    // await page.locator('input').press('ArrowLeft');
    // await page.locator('input').press('ArrowRight');

    // // Nhấn phím Escape
    // await page.locator('input').press('Escape');

    // // Nhấn phím Tab
    // await page.locator('input').press('Tab');

    // // Nhấn phím Space
    // await page.locator('input').press('Space');

    // const areaInput = page.getByPlaceholder('Vùng text cho Demo 4')
    // await areaInput.click()
    // await page.keyboard.press('a')

    // await page.keyboard.type('Hello World',{delay: 300})

    // await page.keyboard.down('Shift')

    // await page.keyboard.press('ArrowRight')

    // await page.keyboard.up('Shift')


    //focus vào vùng demo 5
    await page.locator('#demo5-textarea').click()
    // Select All, Copy, Cut, Paste
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+c');
    await page.keyboard.press('Control+x');
    await page.keyboard.press('Control+v');
    await page.pause()

    // Undo / Redo
    // await page.keyboard.press('Control+z');
    // await page.keyboard.press('Control+y');


});
