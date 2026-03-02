import { test, expect, Page } from '@playwright/test'
import { CRMLoginPage } from './pom/CRMLoginPage'
import { CRMDashboardPage } from './pom/CRMDashboardPage';
import { CRMCustomerPage } from './pom/CRMCustomerPage';
import { CRMNewCustomerPage } from './pom/CRMNewCustomerPage';
import { createMinimalCustomerInfo } from './utils/test-data'

test.beforeEach(async ({page}) => {
    const loginPage = new CRMLoginPage(page);
    await loginPage.goto()
    await loginPage.expectOnPage()
    await loginPage.login('admin@example.com','123456');
})

function createCRMPages(page: Page) {
  return {
    dashboardPage: new CRMDashboardPage(page),
    customersPage: new CRMCustomerPage(page),
  };
}

//2 Ra lệnh viết test
test('TC_01 - Lấy toàn bộ dữ liệu 1 cột sử dụng column Map', async ({ page }) => {
  //3 .. cho tao cái page (request/resolve) => pw robot tiêm (inject) các phụ thuộc vào page choi mình dùng
  //4. Dâng page tận miệng , giờ bạn chỉ việc dùng
  const { dashboardPage, customersPage } = createCRMPages(page);

  await test.step('Verify dashboard da load sau khi login', async () => {
    await dashboardPage.expectOnPage();
  });

  await test.step('Navigate tu dashboardPage -> customer page', async () => {
    await dashboardPage.navigateMenu('Customers');
    await customersPage.expectOnPage();
  });
  await test.step('Get all company names using column map', async () => {
    const companies = await customersPage.getColumnValues('company');
    console.log(companies);
  });
});

test('TC_02 - Lấy dữ liệu nhiều cột', async ({ page }) => {
  const { dashboardPage, customersPage } = createCRMPages(page);

  await test.step('Verify dashboard da load sau khi login', async () => {
    await dashboardPage.expectOnPage();
  });

  await test.step('Navigate tu dashboardPage -> customer page', async () => {
    await dashboardPage.navigateMenu('Customers');
    await customersPage.expectOnPage();
  });

  await test.step('Get table data with multiple columns', async () => {
    const data = await customersPage.getTableData(['company', 'phone', 'active']);
    console.log(data);
    console.table(data);
  });
});

test('TC_03 - Tìm row theo company name', async ({ page }) => {
  const { dashboardPage, customersPage } = createCRMPages(page);

  await test.step('Verify dashboard da load sau khi login', async () => {
    await dashboardPage.expectOnPage();
  });

  await test.step('Navigate tu dashboardPage -> customer page', async () => {
    await dashboardPage.navigateMenu('Customers');
    await customersPage.expectOnPage();
  });

  await test.step('Find row by company name', async () => {
    const row = await customersPage.findRowByColumnValue('company', '__@Khong co o trong table');
    await expect(row).toBeVisible();
    console.log(await row.textContent());
  });
});

