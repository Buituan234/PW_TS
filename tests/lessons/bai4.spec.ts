import { test, expect } from '@playwright/test';

const DemoURL = 'https://demoapp-sable-gamma.vercel.app'

//Cấp 1: Mệnh lệnh của sếp
test('Các cấp độ ayto waiting trong PW: Cấp 1', async ({ page }) => {
    // await page.goto('https://demoapp-sable-gamma.vercel.app')
    // await page.getByRole('link', { name: 'Bài 2: Playwright Locators' }).click()
    // await page.getByRole('button', { name: 'CSS Selector' }).click()
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.locator('//button[@type="button"]//span[contains(.,"Bắt đầu Test")]').click()
    
    const slowButton1 = page.locator('#button-1')

    //lỗi timeout 5000ms
    await slowButton1.click({timeout: 5000})
});

// Cấp 2: Giới hạn của phòng ban
test('Các cấp độ ayto waiting trong PW: Cấp 2', async ({ page }) => {
    // await page.goto('https://demoapp-sable-gamma.vercel.app')
    // await page.getByRole('link', { name: 'Bài 2: Playwright Locators' }).click()
    // await page.getByRole('button', { name: 'CSS Selector' }).click()
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.locator('//button[@type="button"]//span[contains(.,"Bắt đầu Test")]').click()
    
    const slowButton2 = page.locator('#button-2')

    //lỗi timeout 5000ms
    await slowButton2.click()
});

// Cấp 3: Giới hạn của công ty
test('Các cấp độ ayto waiting trong PW: Cấp 3', async ({ page }) => {
    // await page.goto('https://demoapp-sable-gamma.vercel.app')
    // await page.getByRole('link', { name: 'Bài 2: Playwright Locators' }).click()
    // await page.getByRole('button', { name: 'CSS Selector' }).click()
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    const startBtn =  page.locator('#start-btn')
    const continueBtn =  page.locator('#continue-btn')
    const expectedBtn = page.locator('#final-btn')
    
    //action timeout là 10s mà mất 8s tiến trình thì thoải mái
    await startBtn.click()

    // 8s < 10s thỏa mãn
    await continueBtn.click()

    // Tổng phải chờ 16s > báo lỗi
    await expectedBtn.click()

});

// Set lại time out
test.setTimeout(30000)
//TC chạy pass khi set lại timeout toàn cục
test('Set lại timeOut', async ({ page }) => {
    // await page.goto('https://demoapp-sable-gamma.vercel.app')
    // await page.getByRole('link', { name: 'Bài 2: Playwright Locators' }).click()
    // await page.getByRole('button', { name: 'CSS Selector' }).click()
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    const startBtn =  page.locator('#start-btn')
    const continueBtn =  page.locator('#continue-btn')
    const expectedBtn = page.locator('#final-btn')
    
    //action timeout là 10s mà mất 8s tiến trình thì thoải mái
    await startBtn.click()

    // 8s < 10s thỏa mãn
    await continueBtn.click()

    // Tổng phải chờ 16s > thỏa mãn
    await expectedBtn.click()
});

// Ở trong PW có 3 cấp độ để kiểm soát timeOut
// Cấp 1: Cấp độ cao nhất InLine TimeOut (mệnh lệnh của sếp)
// Cấp 2: Trung bình = actionTimeOut => QUy định của phòng ban
// Cấp 3: Thấp nhất: Cục bộ

// mặc định là 30s cho action timeout

// các nút như export button thì cần thời gian chờ lâu thì có thể tăng thời gian timeout
//câu hỏi: nếu ngoài hoặc không set gì cho 1 case thì thời gian time out là 30s, nhưng bên trong test case
//lại set một timeout riêng như 30s thì nó sẽ được tách rời với các await khác hay là chung?

//Web-first assertions

//2 cấp độ
// cấp độ 1: Cao nhất > inline timeout > mệnh lệnh cao nhất
// cấp độ 2: Toàn cục - quy định chung: 5s

//Cấp độ 1: Webfirst assertion
test('Cấp 1: Webfirst assertion', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '🚀 Web-First Assertions'}).click()
    await page.getByText('Bắt đầu chờ').click()
    const statusMessage = page.locator('#status-message')
    
    //Thằng PW sẽ có cơ chế retry để đảm bảo sau x giây sẽ được expect result nếu không sẽ văng timeout
    await expect(statusMessage).toHaveText('Tải dữ liệu thành công!', {timeout: 5000})
});

//Cấp độ 2: Webfirst assertion- theo mặc định 6s
test('Cấp 2: Webfirst assertion', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '🚀 Web-First Assertions'}).click()
    await page.getByText('Bắt đầu chờ').click()
    const statusMessage = page.locator('#status-message')
    
    //Thằng PW sẽ có cơ chế retry để đảm bảo sau x giây sẽ được expect result nếu không sẽ văng timeout
    await expect(statusMessage).toHaveText('Tải dữ liệu thành công!')
});

//test pass
test('Webfirst assertion passed', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '🚀 Web-First Assertions'}).click()
    await page.getByText('Bắt đầu chờ').click()
    const statusMessage = page.locator('#status-message')
    
    //Thằng PW sẽ có cơ chế retry để đảm bảo sau x giây sẽ được expect result nếu không sẽ văng timeout
    await expect(statusMessage).toHaveText('Tải dữ liệu thành công!', {timeout: 8000})
});

//toBeAttachted: Kiểm tra phần tử có tồn tại trong DOM hay không- không quan tâm có hiển thị trên màn hình UI
test('toBeAttached', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()
    await page.locator('#btn-attach').click()
    
    //Thằng PW sẽ có cơ chế retry để đảm bảo sau x giây sẽ được expect result nếu không sẽ văng timeout
    await expect(page.locator('#attached-node')).toBeAttached()
});

//toBeVisible: Kiểm tra phần tử vừa hiển thị trong DOM và vừa hiển thị trên màn hình
//(nó không có display: none/ visibility: hidden, có kích thước chiều rộng chiều cao > 0, không bị che khuất bởi phần tử khác)
test('toBeVisible', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()
    await page.locator('#btn-hide').click()
    await page.locator('#btn-show').click()
    
    await expect(page.locator('#visibility-target')).toBeVisible()
});

//toBeHidden: là phủ định của visible> check bị ẩn trong DOM
test('toBeHidden', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()
    await page.locator('#btn-hide-for-hidden').click()
    
    await expect(page.locator('#hidden-target')).toBeHidden()
});


//toBeChecked: Kiểm tra phần tử có ở trạng thái được chọn hay không
test('toBeChecked', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()
    await page.pause()

    //nhấn vào nút tab
    //await page.locator('#tab-option').click()
    await page.locator('#news-check').click()
    
    // chờ kết quả sau 6s
    //await expect(page.locator('#tab-option')).toBeChecked()
    await expect(page.locator('#news-check')).toBeChecked()
    //await page.pause()
});

//toBeDisable: kiểm tra phần tử bị vô hiệu hóa
test('toBeDisable', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()
    await page.pause()

    //nhấn vào nút enable
    await page.locator('#toggle-disabled').click()
    
    // chờ kết quả sau 6s
    await expect(page.locator('#email')).toBeDisabled()
    //await page.pause()
});

//toBeEnable: phủ định của kiểm tra disable
test('toBeEnable', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()
    // await page.pause()
    // chờ kết quả sau 6s
    await expect(page.locator('#enabled-input')).toBeEnabled()
});

//toBeEditable: có thể nhận được nội dung nhập liệu hay không, không bị disable và không có thuộc tính read only
test('toBeEditable', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()
    // chờ kết quả sau 6s
    await expect(page.locator('#editable')).toBeEnabled()
});

//toBeEmpty: sẽ check phần tử không chứa bất tử phần tử con nào, hoặc không có nội dung text()
test('toBeEmpty', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    //click clear button
    await page.locator('#btn-clear').click()
    // chờ kết quả sau 6s
    await expect(page.locator('#empty-box')).toBeEmpty()
});


//toHaveCount: đếm số phần tử có chính xác không
test('toHaveCount', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    //click thêm 1 item
    await page.locator('#btn-add-item').click()
    // chờ kết quả sau 6s
    await expect(page.locator('//ul[@id="items"]//li')).toHaveCount(3)
});

//toContaintext: Kiểm tra nội dung text của phần tử, không phân biệt hoa thường, tự chuẩn hóa khoảng trắng
test('toContaintext', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    //click vào buttom complex text
    await page.locator('#btn-set-complex-text').click()
    // chờ kết quả sau 6s
    await expect(page.locator('#text-container')).toContainText('john')
    await expect(page.locator('#text-container')).toContainText('example.com')
});

//câu hỏi: có cắt được khoảng trắng ở giữa không?

//toBeFocused: Check con trỏ chuột có nhấp nháy ở ô input nào
test('toBeFocused', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    //click vào input
    await page.locator('#focusable').click()
    // chờ kết quả sau 6s
    await expect(page.locator('#focusable')).toBeFocused()
});

//toHaveValue: check thuộc tính value xem có giá trị nào trong thẻ input hoặc texaerea
test('toHaveValue', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    //click vào set value
    await page.getByText('Set Value', {exact: true}).click()
    // chờ kết quả sau 6s
    await expect(page.locator('#value-input')).toHaveValue('Hello World')
});

//toHaveValue: check mảng chứa bao nhiêu phần tử
test('toHaveValues', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    //click vào set values
    await page.getByText('Set Values', {exact: true}).click()
    // chờ kết quả sau 6s
    await expect(page.locator('#multi-select')).toHaveValues(['Action', 'Drama'])
});

//toContainClass: check xem có chứa class đã tìm không, nhưng mà là sub-string: chỉ cần chứa class đã tìm là pass

//toHaveClass: Check xem có chứa class không nhưng mà là check chính xác > thì mới pass

//toHaveCss

//toHaveAttribute: check xem có chứa phần tử nào không trên thẻ
test('toHaveAttribute', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    //click vào add attribute
    await page.locator('#btn-toggle-attr').click()
    // chờ kết quả sau 6s
    await expect(page.locator('#avatar')).toHaveAttribute('alt','User Avatar')
});


//toHaveID: check xem thẻ có ID đã tìm không
test('toHaveId', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    // chờ kết quả sau 6s
    await expect(page.locator('#unique-id')).toHaveId('unique-id')
});

//toBeInViewport
test('toBeInViewport', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    //scroll xuống 
    await page.locator('#viewport-target').scrollIntoViewIfNeeded()
    // chờ kết quả sau 6s
    await expect(page.locator('#viewport-target')).toBeInViewport()
});

//toHaveText: có chứa chính xác đoạn text đã tìm không, tự động lược bướt khoảng trắng ở đầu và cuối
test('toHaveText', async ({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app/')
    await page.getByRole('link', {name: 'Bài 1: Auto-Wait Demo'}).click()
    await page.getByRole('button', {name: '⏱️ expect() có await'}).click()

    //click vào nút Thitespace Text
    await page.locator('#btn-whitespace-text').click()
    // chờ kết quả sau 6s
    const messageLocator = page.locator('#status-text div div').nth(1)
    await expect(messageLocator).toHaveText('Data loaded successfully!')
});