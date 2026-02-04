import { expect, test, Page } from '@playwright/test'
import { format } from 'date-fns'
const LOGIN_URL = 'https://crm.anhtester.com/admin/authentication'

async function loginAndNavigateToNewCustomer(page: Page, tabName: string) {
    // Vào trang
    await page.goto(LOGIN_URL)
    await expect(page.locator('//h1')).toContainText('Login')

    //Điền thông tin đăng nhập
    await page.locator('#email').fill('admin@example.com')
    await page.locator('#password').fill('123456')
    await page.locator('//button[@type="submit"]').click()

    //Assert nhảy sang trang home page
    await expect(page.locator('//aside[@id="menu"]//span[@class="menu-text"]').nth(1)).toContainText('Customers')

    //Click vào tab Customer
    //await page.locator('//li[contains(@class,"menu-item-customers")]').click()
    await page.locator(`//span[@class="menu-text" and contains(text(),"${tabName}")]`).click()

    //Assert nhảy sang trang Customer
    await expect(page.locator('//div[@class="_buttons"]/a').nth(0)).toContainText('New Customer')
}


test.describe('CRM Customer Page - Positive case', () => {
    test('TC_CUST_01 - Tạo customer (chỉ nhập trường bắt buộc', async ({ page }) => {
        // Đăng nhập và nhảy đến page Customer
        await loginAndNavigateToNewCustomer(page, "Customers")
        //Click vào nút "New customer"
        await page.locator('//div[@class="_buttons"]//a[contains(.,"New Customer")]').click()
        // Assert nhảy qua màn tạo customer thành công với 2 tabs
        await expect(page.locator('//a[@role="tab"]')).toHaveCount(2)

        // Sử dụng lọc theo playwright
        // const containerCompany = page.locator('label', {hasText: "Company"})
        // const asterisk = containerCompany.locator('small').filter({hasText:"*"})

        // Điền thông tin vào trường company và click save thành công
        const dateTime = new Date()
        const dateTimeFormat = format(dateTime, "hh:mm:ss yyyy/MM/dd")
        const companyName = `Conpany name auto - ${dateTimeFormat}`
        await page.locator('#company').fill(companyName)
        await page.locator('//div[@id="profile-save-section"]//button[normalize-space()="Save"]').click()
        await expect(page.locator('h4.customer-profile-group-heading')).toContainText('Profile')
        await expect(page.locator('span.alert-title')).toContainText('Customer added successfully.')

        //Check thông tin của trường
        const URL_page = page.url()
        const URLpageSplit = URL_page.split("/clients/client/")
        const customerID = URLpageSplit[1]
        await expect(page.locator('//span[@class="tw-truncate"]')).toContainText(`${customerID} ${companyName}`)
    })
})