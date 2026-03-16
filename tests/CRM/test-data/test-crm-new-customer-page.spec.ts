import { test, expect, Page } from '@playwright/test'
import { CRMLoginPage } from '../pom/CRMLoginPage'
import { CRMDashboardPage } from '../pom/CRMDashboardPage';
import { CRMCustomerPage } from '../pom/CRMCustomerPage';
import { CRMNewCustomerPage } from '../pom/CRMNewCustomerPage';
import { createMinimalCustomerInfo } from '../utils/test-data'
import { getTestDataSimple } from '../../lessons/crm-practice/data-practice';

test.beforeEach(async ({page}) => {
    const loginPage = new CRMLoginPage(page);
    await loginPage.goto()
    await loginPage.expectOnPage()
    await loginPage.login('admin@example.com','123456');
})

function createCRMPage(page: Page){
    return {
        dashboardPage: new CRMDashboardPage(page),
        customerPage: new CRMCustomerPage(page),
        newCustomerPage: new CRMNewCustomerPage(page),
        //profile
    }
}

test('TC_CUST_01- Tạo Customer (Chỉ nhập trường bắt buộc', async({page}) => {
    const {dashboardPage, customerPage, newCustomerPage} = createCRMPage(page)

    await test.step('Verify dashboard da load sau khi login', async()=>{
        await dashboardPage.expectOnPage()
    })

    await test.step('Navigate từ dashboardPage > Customer Page', async()=>{
        await dashboardPage.navigateMenu('Customers')
        await customerPage.expectOnPage()
    })

    await test.step('Navigate từ CustomerPage > new Customer Page', async()=>{
        await customerPage.clickAddNewCustomer()
        await newCustomerPage.expectOnPage()
    })

    const minimalData = getTestDataSimple('customers','minimal')
    console.log(minimalData);

    const customerInfo = createMinimalCustomerInfo()
    await test.step('Fill required compnany field', async()=>{
        await newCustomerPage.fillCompany(customerInfo.company)
        await newCustomerPage.clickSaveButton()
    })
})