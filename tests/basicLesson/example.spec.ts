import { test, expect } from '@playwright/test';
//fixtures
test('has title', async ({ page, context }) => {
  //Tab 1: Trang playwright
  const playwrightPage = page
  await playwrightPage.goto('https://playwright.dev/');
  await playwrightPage.getByRole('button', { name: 'Search (Ctrl+K)' }).click();
  await playwrightPage.getByRole('searchbox', { name: 'Search' }).fill('Locators');
  console.log('Tab 1 da go locators vao o tim kiem');
  
  //Tab2: trang anh tester hrm
  console.log('Dang mo tab2');
  const hrmPage = await context.newPage()
  await hrmPage.goto('https://hrm.anhtester.com/');
  await hrmPage.getByRole('textbox', { name: 'Your Username' }).click();
  await hrmPage.getByRole('textbox', { name: 'Your Username' }).fill('admin_example');
  await hrmPage.getByRole('textbox', { name: 'Enter Password' }).click();
  await hrmPage.getByRole('textbox', { name: 'Enter Password' }).fill('passwrd_example');
  console.log('Tab 2 da dien thong tin dang nhap ');
  console.log('Back ve tab1');
  await playwrightPage.getByRole('searchbox', { name: 'Search' }).press('Enter')
  console.log('Tab 1 dang cho ket qua xua hien');
  await page.pause()
  await playwrightPage.screenshot({path: 'screenshots/tab1-playwright.png'})
  await hrmPage.screenshot({path: 'screenshots/tab2-hrm.png'})
  
});