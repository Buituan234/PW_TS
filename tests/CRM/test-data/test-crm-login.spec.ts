import { test, expect } from '@playwright/test'
import { CRMLoginPage } from './pom/CRMLoginPage'
import { CRMDashboardPage } from './pom/CRMDashboardPage'

test('CRM Login page - login thành công', async ({ page }) => {
    // AAA
    // Arrange: Khởi tạo điều khiện cần thiết (Ở đây là tìm được đến trang đăng nhập)
    const loginPage = new CRMLoginPage(page)
    const dashboardPage = new CRMDashboardPage(page)

    await loginPage.goto()
    await loginPage.expectOnPage()

    //Action: Thực hiện các hành động
    await loginPage.login('admin@example.com', '123456')

    //Assert: Kết quả mong muốn
    await dashboardPage.expectOnPage()
})