import { expect, test, Page } from '@playwright/test'
import { format } from 'date-fns'
import { faker } from '@faker-js/faker';
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
function createRandomUser() {
    return {
        vat: faker.string.uuid(),
        phone: faker.phone.number(),
        website: faker.internet.url(),
        currency: "USD",
        language: "Vietnamese",
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: "Vietnam"
    };
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
    test('TC_CUST_02 - Tạo customer (Nhập thông tin đầy đủ)', async ({ page }) => {
        // Đăng nhập và vào page customer
        await loginAndNavigateToNewCustomer(page, "Customers")

        //Nhảy đến trang tạo customer mới
        await page.locator('//div[@class="_buttons"]//a[contains(.,"New Customer")]').click()
        expect(page.url()).toBe('https://crm.anhtester.com/admin/clients/client')
        await expect(page.locator('//label[@for="company"]')).toContainText('* Company')

        // Điền thông tin tất cả các trường
        const dateNow = new Date()
        const formatDateNow = format(dateNow, "hh:mm:ss yyyy/MM/dd")
        const companyName = `Company name auto - ${formatDateNow}`
        await page.locator('//input[@id="company"]').fill(companyName)
        await page.locator('//input[@id="vat"]').fill('123')
        await page.locator('//input[@id="phonenumber"]').fill('123')
        await page.locator('//input[@id="website"]').fill('https://crm.anhtester.com')

        //Chọn một giá trị của Currency
        const currencyDropdown = page.locator('//label[@for="default_currency"]//following-sibling::div[contains(@class,"dropdown")]')
        await currencyDropdown.click()
        await page.locator('#bs-select-2-1').click()
        await expect(currencyDropdown.locator('//button[@type="button"]')).toHaveAttribute("title", "USD $")

        await page.locator('#address').fill('Hai Bà Trưng')
        await page.locator('#city').fill('Hà Nội')
        await page.locator('#state').fill('Hà Nội')
        await page.locator('#zip').fill('7000')

        //Chọn một Country
        const countryDropdown = page.locator('//label[@for="country"]//following-sibling::div[contains(@class,"dropdown")]')
        await countryDropdown.click()
        const optionVietnam = page.locator('#bs-select-4-243')
        await optionVietnam.scrollIntoViewIfNeeded()
        await optionVietnam.click()
        await expect(countryDropdown.locator('//button[@type="button"]')).toHaveAttribute("title", "Vietnam")

        //Click nút Save
        await page.locator('//div[@id="profile-save-section"]//button[normalize-space()="Save"]').click()
        const URL_Profile = page.url()
        const URl_2Part = URL_Profile.split('/clients/client/')
        const customerID = URl_2Part[1]
        await expect(page.locator('//span[@class="tw-truncate"]')).toContainText(`${customerID} ${companyName}`)

        //Validate các thông tin ở customer details
        await expect(page.locator('input#company')).toHaveAttribute('value', `${companyName}`)
        await expect(page.locator('input#vat')).toHaveAttribute('value', '123')
        await expect(page.locator('input#phonenumber')).toHaveAttribute('value', '123')
        await expect(page.locator('input#website')).toHaveAttribute('value', 'https://crm.anhtester.com')
        await expect(page.locator('input#phonenumber')).toHaveAttribute('value', '123')
        await expect(page.locator('//select[@id="default_currency"]//following-sibling::button//div[@class="filter-option-inner-inner"]'))
            .toHaveText('USD')
        await expect(page.locator('textarea#address')).toContainText('Hai Bà Trưng')
        await expect(page.locator('input#city')).toHaveAttribute('value', 'Hà Nội')
        await expect(page.locator('input#state')).toHaveAttribute('value', 'Hà Nội')
        await expect(page.locator('input#zip')).toHaveAttribute('value', '7000')
        await expect(page.locator('//select[@id="country"]//following-sibling::button[@type="button"]//div[@class="filter-option-inner-inner"]'))
            .toHaveText('Vietnam')
    })
    test('TC_CUST_02 - Tạo customer (Nhập thông tin đầy đủ) với cách fake data', async ({ page }) => {
        // Đăng nhập và vào page customer
        await loginAndNavigateToNewCustomer(page, "Customers")

        //Nhảy đến trang tạo customer mới
        await page.locator('//div[@class="_buttons"]//a[contains(.,"New Customer")]').click()
        expect(page.url()).toBe('https://crm.anhtester.com/admin/clients/client')
        await expect(page.locator('//label[@for="company"]')).toContainText('* Company')

        // Điền thông tin tất cả các trường
        const dateNow = new Date()
        const formatDateNow = format(dateNow, "hh:mm:ss yyyy/MM/dd")
        const companyName = `Company name auto - ${formatDateNow}`
        await page.locator('//input[@id="company"]').fill(companyName)
        const informationField = createRandomUser()
        await page.locator('//input[@id="vat"]').fill(informationField.vat)
        await page.locator('//input[@id="phonenumber"]').fill(informationField.phone)
        await page.locator('//input[@id="website"]').fill(informationField.website)

        //Chọn một giá trị của Currency
        const currencyDropdown = page.locator('//label[@for="default_currency"]//following-sibling::div[contains(@class,"dropdown")]')
        await currencyDropdown.click()
        await page.locator('#bs-select-2-1').click()
        await expect(currencyDropdown.locator('//button[@type="button"]')).toHaveAttribute("title", "USD $")

        //Chọn một giá trị của default language
        // await page.locator('//div[@class="form-group"]')
        //     .filter({ has: page.locator('//label[@for="default_language"]') })
        //     .locator('//button[@type="button"]')
        //     .click()
        // await page.locator('//a[@id="bs-select-3-11"]').scrollIntoViewIfNeeded()
        // await page.locator('//a[@id="bs-select-3-11"]').click()
        
        // Cách 2
        const defaultLanguage = page.locator('//select[@id="default_language"]')
        await defaultLanguage.selectOption('Vietnamese')
        // await page.pause()


        await page.locator('#address').fill(informationField.address)
        await page.locator('#city').fill(informationField.city)
        await page.locator('#state').fill(informationField.state)
        await page.locator('#zip').fill(informationField.zipCode)

        //Chọn một Country
        const countryDropdown = page.locator('//label[@for="country"]//following-sibling::div[contains(@class,"dropdown")]')
        await countryDropdown.click()
        const optionVietnam = page.locator('#bs-select-4-243')
        await optionVietnam.scrollIntoViewIfNeeded()
        await optionVietnam.click()
        await expect(countryDropdown.locator('//button[@type="button"]')).toHaveAttribute("title", "Vietnam")

        //Click nút Save
        await page.locator('//div[@id="profile-save-section"]//button[normalize-space()="Save"]').click()
        const URL_Profile = page.url()
        const URl_2Part = URL_Profile.split('/clients/client/')
        const customerID = URl_2Part[1]
        await expect(page.locator('//span[@class="tw-truncate"]')).toContainText(`${customerID} ${companyName}`)

        //Validate các thông tin ở customer details
        await expect(page.locator('input#company')).toHaveAttribute('value', `${companyName}`)
        await expect(page.locator('input#vat')).toHaveAttribute('value', informationField.vat)
        await expect(page.locator('input#phonenumber')).toHaveAttribute('value', informationField.phone)
        await expect(page.locator('input#website')).toHaveAttribute('value', informationField.website)
        await expect(page.locator('input#phonenumber')).toHaveAttribute('value', informationField.phone)
        await expect(page.locator('//select[@id="default_currency"]//following-sibling::button//div[@class="filter-option-inner-inner"]'))
            .toHaveText(informationField.currency)
        await expect(page.locator('//select[@id="default_language"]//following-sibling::button')).toHaveAttribute("title","Vietnamese")
        await expect(page.locator('textarea#address')).toContainText(informationField.address)
        await expect(page.locator('input#city')).toHaveValue(informationField.city)
        await expect(page.locator('input#state')).toHaveValue(informationField.state)
        await expect(page.locator('input#zip')).toHaveValue(informationField.zipCode)
        await expect(page.locator('//select[@id="country"]//following-sibling::button[@type="button"]//div[@class="filter-option-inner-inner"]'))
            .toHaveText(informationField.country)
    })
})