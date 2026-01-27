import { test, expect, Page } from '@playwright/test';
// Stat dùng để đọc thông tin file trả về 
import { stat } from 'node:fs/promises';

const DEMO_URL = 'https://demoapp-sable-gamma.vercel.app'

test('Ví dụ về upload file', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '📤 Upload Files' }).click()

    const visible = page.locator('#visible-input')
    await visible.setInputFiles('tests/filesUpload/textTest1.txt')
    await expect(page.locator('//span[contains(normalize-space(.),"Đã chọn: ")]')).toContainText('textTest1.txt')
    await page.pause()
});

test('Ví dụ về nút upload file bị ẩn', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '📤 Upload Files' }).click()

    const nutDisable = page.locator('#hidden-input-upload')
    await nutDisable.setInputFiles('tests/filesUpload/textTest1.txt')
    await expect(page.locator('#hidden-input-upload')).toBeAttached()

    await expect(page.locator('text=Đã chọn:')).toContainText('textTest1.txt');
    await page.pause()
});

test('Ví dụ nút upload file không có thẻ input', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '📤 Upload Files' }).click()

    // Sử dụng cách bắt sự kiện filechooser
    const chooserPromise = page.waitForEvent('filechooser');
    await page.locator('#fancy-button').click();
    const chooser = await chooserPromise;
    await chooser.setFiles('tests/filesUpload/textTest1.txt');
    // Verify bằng text hiển thị tên file trên UI
    await expect(page.locator('text=Đã chọn:')).toContainText('textTest1.txt');

    await page.pause()
});

test('Ví dụ upload nhiều file', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '📤 Upload Files' }).click()

    const multiUpload = page.locator('#multi-input')

    //Upload nhiều file
    await multiUpload.setInputFiles(['tests/filesUpload/textTest1.txt', 'tests/filesUpload/textTest2.txt'])
    // Verify bằng text hiển thị tên file trên UI
    await expect(page.locator('//span[contains(.,"Số file:")]')).toContainText('2')
    await page.pause()

    //Xóa
    await multiUpload.setInputFiles([])
    await expect(page.locator('text=Chưa có file nào').nth(2)).toBeVisible()
    await page.pause()
});


test('Ví dụ về download file', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '📤 Upload Files' }).click()

    //1. Đợi event download
    // Đợi cho tất cả các promise con ở trong array thực hiện thành công rồi lấy kết quả

    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#download-demo-btn').click()
    ])

    const fileName = download.suggestedFilename()
    console.log(fileName)

    //2. Kiểm tra tên file (suggested)
    expect(download.suggestedFilename()).toBe('login-data.xlsx')

    //3. Luuw file về máy
    await download.saveAs('download/login-data-rename.xlsx')

    //4. Check thông tin file
    const infoFile = await stat('download/login-data-rename.xlsx')
    console.log(infoFile.size);
    expect(infoFile.size).toBeGreaterThan(100)

    await page.pause()

});

test('Ví dụ về shadow DOM', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 5: Shadow DOM & iFrame' }).click()
    await page.getByRole('tab', { name: '🧩 Shadow DOM & iFrame' }).click()

    //tương tác như 1 element bình thường, chỉ cần trỏ tới thằng DOM > và từ đó dùng locator chain để tương tác
    // phần còn lại PW lo

    const openHost = page.locator('open-shadow-el#open-shadow-demo');
    await openHost.locator('#os-input').fill('Hello Shadow');
    await openHost.locator('#os-btn').click();
    await expect(openHost.locator('#os-status')).toHaveText('You typed: Hello Shadow');

    // Shadow DOM (CLOSED): không thể pierce. Cần evaluate trong browser context nếu buộc phải chạm vào
    const closedHost = page.locator('closed-shadow-el#closed-shadow-demo');
    const showdowText = await closedHost.textContent()
    console.log(showdowText);

    await page.pause()

});

test('Ví dụ về iframe', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 5: Shadow DOM & iFrame' }).click()
    await page.getByRole('tab', { name: '🧩 Shadow DOM & iFrame' }).click()

    // Cách 1: Theo ID (dễ nhất)
    const frame = page.frameLocator('#demo-iframe')
    await frame.locator('#if-input').fill('Hello iFrame');
    await frame.locator('#if-btn').click();
    await expect(frame.locator('#if-status')).toHaveText('You typed: Hello iFrame');

    // CÁCH 2: Theo title attribute
    const iframeSelector = 'iframe[title="payment-iframe"]';
    //page.locator là dùng để tương tác cho cả iframe mà không thể tương tác đến các thẻ bên trong
    //page.framelocator thì dùng để tương tác cho các element bên trong iframe, không thể thao tác với toàn bộ iframe
    const iframeElement = page.locator(iframeSelector);
    await iframeElement.waitFor({ state: 'attached', timeout: 10000 });
    await iframeElement.scrollIntoViewIfNeeded();

    // CÁCH 3: Theo thứ tự (nth) - chọn iframe thứ N từ tất cả iframe trong panel
    // Trong UI có 4 iframe:
    // iframe[0] = demo-iframe (section 2)
    // iframe[1] = payment-iframe (section 3, demo 1)
    // iframe[2] = nth iframe (section 3, demo 2) ← chọn cái này (nth 2, index 2)
    // iframe[3] = billing-frame (section 3, demo 3)

    const iframeElementNth = page.locator('iframe').nth(2);
    await iframeElementNth.waitFor({ state: 'attached', timeout: 10000 });
    await iframeElementNth.scrollIntoViewIfNeeded();

    await page.waitForTimeout(1000);

    const frameByNth = page.frameLocator('iframe').nth(2);

    await frameByNth.locator('#nth-input').fill('Second iframe test', { timeout: 30000 });
    await frameByNth.locator('#nth-btn').click();
    await expect(frameByNth.locator('#nth-status')).toHaveText(/Second iframe test/);

    //// CÁCH 4: Theo name attribute
    const iframeSelectorName = 'iframe[name="billing-frame"]';
    const iframeElementName = page.locator(iframeSelectorName);
    await iframeElementName.waitFor({ state: 'attached', timeout: 10000 });
    await iframeElementName.scrollIntoViewIfNeeded();

    // Nếu có 2 iframe lồng nhau thì ta chỉ cần locator chain liên tục để tìm ra vị trí iframe bên trong
    // const outerFrame = page.frameLocator('#outer-frame')
    // const innerFrame = outerFrame.frameLocator('#inner-frame')

    await page.pause()

});

test('Ví dụ về evaluate', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 5: Shadow DOM & iFrame' }).click()
    await page.getByRole('tab', { name: '🔧 evaluate()' }).click()

    const panel = page.getByRole('tabpanel', { name: '🔧 evaluate()' });

    // ✅ CẦN DÙNG: Đọc NHIỀU properties cùng lúc (không có method native)
    // Nếu dùng native phải gọi nhiều lần, evaluate() đọc 1 lần
    const domInfo = await panel.locator('#demo-input-1').evaluate((el: HTMLInputElement) => {
        return {
            value: el.value,
            placeholder: el.placeholder,
            type: el.type,
            disabled: el.disabled,
            maxLength: el.maxLength,
            className: el.className,
            defaultValue: el.defaultValue,
            selectionStart: el.selectionStart, // Không có native method
            selectionEnd: el.selectionEnd,     // Không có native method
        };
    });
    console.log('DOM Info:', domInfo);

    await page.pause()

});

async function isImageOK(page: Page, imgLocator: string): Promise<boolean> {
    const result = await page
        .locator(imgLocator)
        .evaluate(
            (img: HTMLImageElement) => {
                console.log('widgth: ', img.naturalWidth);
                console.log('height: ', img.naturalHeight);
                return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
            })
    return result 
}
test('Ví dụ về check ảnh đã load ok chưa?', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 5: Shadow DOM & iFrame' }).click()
    await page.getByRole('tab', { name: '🖼️ Broken Images' }).click()

    // const checkImageTrue = await isImageOK(page, '#img-1')
    // expect(checkImageTrue).toBeTruthy()

    const checkImageFalse = await isImageOK(page, '#img-2')
    expect(checkImageFalse).toBeFalsy()


    await page.pause()

});