// Bài tập (Yêu cầu): https://demoapp-sable-gamma.vercel.app
// Tìm landmark navigation có tên "Primary" và xác nhận link "Home" là trang hiện tại.
// Điền ô tìm kiếm bằng accessible name "Search docs".
// Tương tác với ô nhập được gắn label qua aria-labelledby là "Mã nội bộ".
// Click "Tải dữ liệu" và chờ live region thông báo "Đã tải 3 kết quả".

import { test, expect } from '@playwright/test';
import {performance} from 'node:perf_hooks'

// test('Advanced accessibility scenarios', async ({ page }) => {
//     await page.goto('https://demoapp-sable-gamma.vercel.app')
//     await page.getByRole('link', {name: 'Bài 2: Playwright Locators'}).click()
//     await page.getByRole('button', {name: 'Playwright getByRole'}).click()
//     await page.getByRole('button', {name: 'Bài tập'}).nth(1).click()

//     // Tìm landmark navigation có tên "Primary" và xác nhận link "Home" là trang hiện tại.
//     const Primary_navigation = page.getByRole('navigation')
//     const Home_link = page.getByRole('link', {name: 'Home'})
//     await expect(Home_link).toBeFocused

//     // Điền ô tìm kiếm bằng accessible name "Search docs".
//     const search_doc = page.getByRole('textbox', {name: 'Search docs'})
//     await expect(search_doc).toHaveAttribute('aria-label','Search docs')
//     await search_doc.fill('Bui Tuan')

//     //Tương tác với ô nhập được gắn label qua aria-labelledby là "Mã nội bộ".
//     const o_nhap = page.getByRole('textbox', {name: 'Mã nội bộ'})
//     await expect(o_nhap).toHaveAttribute('aria-labelledby', 'q2-secret-label')
//     await o_nhap.fill('Bui Tuan 2')

//     // Click "Tải dữ liệu" và chờ live region thông báo "Đã tải 3 kết quả".
//     const status_liveRegion_before = page.getByRole('status')
//     await expect(status_liveRegion_before).toHaveText('Sẵn sàng…')
//     const tai_du_lieu_button = page.getByRole('button', {name: 'Tải dữ liệu'})
//     await tai_du_lieu_button.click()
//     const status_liveRegion_after = page.getByRole('status')
//     await expect(status_liveRegion_after).toHaveText('Đã tải 3 kết quả')
    
// });

// Click "Load comments" và kiểm tra aria-busy trên khu vực comments chuyển đúng trạng thái.
// Chờ danh sách comment xuất hiện và đếm đúng 3 phần tử listitem.
// Dùng nth() để chọn comment thứ 2 chứa text "Comment B".
    // test('Dynamic content patterns', async({ page }) => {
    //     await page.goto('https://demoapp-sable-gamma.vercel.app')
    //     await page.getByRole('link', {name: 'Bài 2: Playwright Locators'}).click()
    //     await page.getByRole('button', {name: 'Playwright getByRole'}).click()
    //     await page.getByRole('button', {name: 'Bài tập'}).nth(1).click()

    //     // Click "Load comments" và kiểm tra aria-busy trên khu vực comments chuyển đúng trạng thái.
    //     const ariaBusy_before = page.getByRole('region', {name: 'Comments'})
    //     await expect(ariaBusy_before).toHaveAttribute('aria-busy', 'false')
    //     const loadComment_button = page.getByRole('button', {name: 'Load comments'})
    //     await loadComment_button.click()
    //     const ariaBusy_after = page.getByRole('region', {name: 'Comments'})
    //     await expect(ariaBusy_after).toHaveAttribute('aria-busy', 'false')

    //     //Chờ danh sách comment xuất hiện và đếm đúng 3 phần tử listitem.
    //     const list_abc = ariaBusy_after.getByRole('list')
    //     await expect(list_abc).toHaveCount(1)
    //     const itemList = list_abc.getByRole('listitem')
    //     await expect(itemList).toHaveCount(3)
    //     await expect(itemList.nth(0)).toHaveText('Comment A')
    //     await expect(itemList.nth(1)).toHaveText('Comment B')
    //     await expect(itemList.nth(2)).toContainText('Comment C')

    //     // Dùng nth() để chọn comment thứ 2 chứa text "Comment B".
    //     await itemList.nth(1).highlight()
    //     await page.pause()
    // });

// Click nút "Self remove" và xác nhận nút biến mất (toHaveCount(0)).
// Kiểm tra nút "Danger submit" bị disabled và ô "Readonly token" có thuộc tính readonly.
// Click "Trigger error" và xác nhận alert hiển thị nội dung lỗi.
    test('Error handling & edge cases', async ({ page }) => {
        await page.goto('https://demoapp-sable-gamma.vercel.app')
        await page.getByRole('link', {name: 'Bài 2: Playwright Locators'}).click()
        await page.getByRole('button', {name: 'Playwright getByRole'}).click()
        await page.getByRole('button', {name: 'Bài tập'}).nth(1).click()

        //Click nút "Self remove" và xác nhận nút biến mất (toHaveCount(0)).
        const selfRemove = page.getByRole('button', {name: 'Self remove'})
        await selfRemove.click()
        await expect(selfRemove).toHaveCount(0)

        //Kiểm tra nút "Danger submit" bị disabled và ô "Readonly token" có thuộc tính readonly.
        const dangerSubmit = page.getByRole('button', {name: 'Danger submit', disabled: true})
        await expect(dangerSubmit).toBeDisabled()
        const readonlToken = page.getByRole('textbox', {name: 'Readonly token'})
        await expect(readonlToken).toHaveAttribute('readonly','')

        // Click "Trigger error" và xác nhận alert hiển thị nội dung lỗi.
        const triggerError = page.getByRole('button', {name: 'Trigger error'})
        await triggerError.click()
        const message = page.getByRole('alert')
        await expect(message).toContainText('Đã có lỗi xảy ra')
    })
