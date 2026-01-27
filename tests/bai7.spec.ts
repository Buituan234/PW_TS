import { test, expect } from '@playwright/test';

const DEMO_URL = 'https://demoapp-sable-gamma.vercel.app'

test('Ví dụ về checkbox/radio', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '☑️ Checkboxes & Radio' }).click()

    // Checkbox 1: check() / uncheck()
    await page.locator('#demo-checkbox-1').check();
    await expect(page.locator('#demo-checkbox-1')).toBeChecked();

    await page.locator('#demo-checkbox-1').uncheck();
    await expect(page.locator('#demo-checkbox-1')).not.toBeChecked();

    // Checkbox 2: setChecked(true/false)
    await page.locator('#demo-checkbox-2').setChecked(true);
    await expect(page.locator('#demo-checkbox-2')).toBeChecked();

    await page.locator('#demo-checkbox-2').setChecked(false);
    await expect(page.locator('#demo-checkbox-2')).not.toBeChecked();

    // Checkbox 3: Idempotent - Gọi lại nhiều lần an toàn
    await page.locator('#demo-checkbox-3').setChecked(true);
    await page.locator('#demo-checkbox-3').setChecked(true); // ✅ Vẫn OK, không có side effect
    await expect(page.locator('#demo-checkbox-3')).toBeChecked();

    await page.pause()

});

// Ví dụ là thằng checkbox đang ko check()
//locator.check() > checkbox sẽ dc check()
//locator.check() > checkbox này vẫn là check()

//locator.check() => Đảm bảo ô được check (nếu đã check => không làm gì cả)
//locator.uncheck() => Đảm bảo ô bị uncheck (Nếu dã bỏ check => Không làm gì cả)
//locator.setChecked(boolean) =>

//const shouldBeChecked = true;
//await page.locator().check()
//expect(pageXOffset.locator).toBeChecked()
// locator.setChecked(shouldBeChecked) => luôn đảm bảo cho radio hoặc checkbox được check

test('Ví dụ về dropdown native', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '☑️ Checkboxes & Radio' }).click()

    const dropdownLocator = page.locator('#country-select')

    //với các dạng dropdown native (có thẻ select) thì không cần cick để mở mà có thể chọn luôn giá trị option
    // await dropdownLocator.click()
    await dropdownLocator.selectOption('Vietnam')
    await page.pause()

});

//Không dùng select > cần click
test('Ví dụ về dropdown custom', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '☑️ Checkboxes & Radio' }).click()

    //Click vào dropdown
    const panel = page.locator('//div[@class="ant-card-head" and contains(.,"Custom Dropdown (Không dùng <select>)")]//following-sibling::div//div[@role="button"]')
    await panel.click()
    //Chọn item trong dropdown
    await panel.locator('//following-sibling::ul//li[text()="Banana"]').click()
    await page.pause()

});

test('Ví dụ về dropdown có list option dài cần scroll', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '☑️ Checkboxes & Radio' }).click()

    // Mở dropdown lớn theo trigger
    const panel = page.locator('//div[@class="ant-card-head" and contains(.,"Custom Countries Dropdown (Scrollable, Multi-select)")]//following-sibling::div//div[@role="button"]')
    await panel.click()

    //Chọn item trong dropdown
    const targets = ['Vietnam', 'Japan', 'United States', 'Germany', 'Brazil'];
    for (const name of targets) {
        const item = panel.locator(
            "xpath=//following-sibling::ul//li[.//span[normalize-space()='" + name + "']]"
        );

        // Scroll item vào view và click
        await item.scrollIntoViewIfNeeded();
        await item.click();
    }

    //// CÁCH 1: Click lại trigger để đóng
    await panel.click();
    await page.pause()

});

test('Ví dụ về native dialog', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '⚠️ Alerts & Modals' }).click()

    //playwright tự động xử lý và accept tất cả các dialog bởi default
    // ALERT → Accept và assert UI
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('Hello from alert');
        await dialog.accept();
    });
    await page.locator('#btn-alert').click();
    await expect(page.locator('#alert-result')).toHaveText('Alert acknowledged');

    // CONFIRM → Accept (YES) và assert UI
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toContain('Are you sure');
        await dialog.accept();
    });
    await page.locator('#btn-confirm').click();
    await expect(page.locator('#confirm-result')).toHaveText('Confirmed: YES');

    // CONFIRM → Dismiss (NO) và assert UI
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        await dialog.dismiss();
    });
    await page.locator('#btn-confirm').click();
    await expect(page.locator('#confirm-result')).toHaveText('Confirmed: NO');

    // PROMPT → Accept với text và assert UI hiển thị đúng text
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toContain('Your name');
        //truyền text vào input
        await dialog.accept('Tester');
    });
    await page.locator('#btn-prompt').click();
    await expect(page.locator('#prompt-result')).toHaveText('Hello, Tester');

    // PROMPT → Dismiss (Cancel) và assert UI
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        await dialog.dismiss();
    });
    await page.locator('#btn-prompt').click();
    await expect(page.locator('#prompt-result')).toHaveText('Prompt canceled');

    await page.pause()
});

test('Ví dụ UI modal', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click()
    await page.getByRole('tab', { name: '⚠️ Alerts & Modals' }).click()

    // Mở modal, điền tên, xác nhận và assert kết quả
    await page.locator('#open-basic-modal').click();
    const dialog = page.getByRole('dialog', { name: 'Thông báo' });
    await expect(dialog).toBeVisible();
    await dialog.locator('#basic-modal-input').fill('Alice');
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('#basic-modal-result')).toHaveText('Submitted: Alice');

    await page.pause()
});


