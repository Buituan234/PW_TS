// Web accessibility (Khả năng tiếp cận) - nen tang cua getByRole


//ggetByRle cua Playwright se xac dịnh nhưng thẻ HTML co cau truc nhu the nao => theo vai tro ngam dịnh


import { test, expect } from '@playwright/test';

test('Vai tro ngam dinh', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app')
    await page.getByRole('link', { name: 'Bài 2: Playwright Locators' }).click()
    await page.getByRole('button', { name: 'CSS Selector' }).click()
    //page.getByRole('link',{name: 'Trang chủ}).click()
    // const linkLocator = page.getByRole('link', { name: 'Trang chủ' })
    // console.log(' Phan tu o tren web', await linkLocator.count());
    // linkLocator.nth(0).hover()

    // const linkLocator2 = page.getByRole('button', {name: 'Lưu'})
    // linkLocator2.hover()
    // linkLocator2.highlight()

    // const fillLocator = page.getByRole('textbox', {name: 'Tên:'})
    // fillLocator.fill('Tuan')
    //await linkLocator.hover()
    //await linkLocator.highlight()

    // await page.getByRole('checkbox', {name: 'Đồng ý điều khoản'}).click()
    // await page.getByRole('radio', {name: 'Nam'}).check()
    // await page.getByRole('textbox', {name: 'email'}).pressSequentially('buituan@gmai.com')
    // await page.getByRole('textbox', {name: 'Mật Khẩu:'}).fill('Không có mật khẩu')
    // await page.getByRole('textbox', {name: 'Ghi chú:'}).fill('ghi chú 1123')

    // const checkbox = page.getByRole('checkbox', {name: 'Tôi đồng ý', checked: true})
    // console.log(await checkbox.count());
    // await expect(checkbox).toBeVisible()
    
    // await page.getByRole('button', {name: 'Bài tập'}).nth(1).click()

    // const bInDam = page.getByRole('button', {name: 'Bold', pressed: true})

    // const moreOptionLocator = page.getByRole('button', {name: 'More options', expanded: false})
    // await moreOptionLocator.click()
    // const fullOption = page.getByRole('menu', {name: 'More'})
    // await expect(fullOption).toBeVisible()
    // await page.getByRole('menuitem', {name: 'Duplicate'}).click()

    // await expect(fullOption).toBeDisabled
    // await moreOptionLocator.click()
    // const downLoadLocator = page.getByRole('menuitem', {name: 'Download (disabled)', disabled: true})
    // await expect(downLoadLocator).toBeDisabled()

    // await page.getByRole('combobox', {name: 'Font family'}).click()
    // await page.getByRole('option', {name: 'Roboto'}).click()

    // await page.getByRole('textbox', {name: 'Tiêu đề'}).fill('Bài viết mới.')
    
    // const publishButton = page.getByRole('button', {name: 'Publish', disabled: true})
    // expect(publishButton).toBeDisabled

    // await page.pause()

    await page.locator('.edit-profile-btn').click()
    // await page.locator('#password-input').fill('123')
    // const submit_button = page.locator('#login-submit-btn')
    // await submit_button.click()
    await page.pause()
});


//1 the dau tien sau dau < thi tat ca cac phan tu tiep theo dc goi la attribute hay la thuoc tinh
// <input id="username-input" type="text" style="width: 200px; padding: 5px; border: 1px solid rgb(204, 204, 204)