import { test, expect, Page, Locator } from '@playwright/test';
import { error } from 'console';
// Stat dùng để đọc thông tin file trả về 
import { addDays, differenceInDays, format, parse, isValid, getYear, getMonth } from 'date-fns';

const DEMO_URL = 'https://demoapp-sable-gamma.vercel.app'

test('Ví dụ về format date picker', async ({ page }) => {
    // date kaf 1 đối tượng object ở trong JS/TS
    // HN + 7  >  UTC > Time  - 7
    // const now = new Date() // lấy thời gian hiện tại theo UTC+0
    // console.log(now.getFullYear());
    // console.log(now.getMonth() + 1);
    // console.log(now.getDate());
    // console.log(now);

    // //yyyy-MM-ddThh:mm:ss.sssZ (ISO 8601)
    // const specificDate = new Date('2025-01-30T10:00:00');
    // console.log(specificDate);

    // Thay đổi dạng ngày tháng
    const today = new Date()
    console.log(today);
    console.log(new Date().getTimezoneOffset());

    const formatDate = format(today, 'dd/MM/yyyy') //MM là ám chỉ tháng, còn mm là kí hiệu của phút
    console.log(formatDate);
    const formatTime = format(today, 'HH:mm:ss') //HH là ám chỉ hệ 24h (0-23) còn hh là ám chỉ hệ 12h (0-12 + AM/PM)
    console.log(formatTime);

    const today2 = new Date('2025-11-06')
    const inTenDay = addDays(today2, 10)
    console.log(inTenDay);

    const dataA = new Date('2025-11-11')
    const dataB = new Date('2025-11-06')
    const daysBetween = differenceInDays(dataB, dataA)
    console.log('B hơn A ' + daysBetween + ' ngày');

});

async function moDropDown(page: Page, tenPhanDemo: string, index: number) {
    const phanDemo = page.locator(`xpath=//div[contains(@class,"ant-card")][.//div[contains(@class,"ant-card-head-title") and normalize-space()="${tenPhanDemo}"]]`)
    const dropdownButtons = phanDemo.locator('xpath=.//div[contains(@class,"ant-card-body")]//div[contains(@class,"ant-space-item")][./div[contains(@class,"ant-select")]]')
    const dropdownButton = dropdownButtons.nth(index - 1)
    await dropdownButton.click()
    const dropDown = page.locator('//div[contains(@class,"ant-select-dropdown")]')
    return dropDown
}
const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
async function chonOption(page: Page, optionName: string) {
    const optionLocator = page.locator(`xpath=//div[contains(@class,"ant-select-dropdown")]//div[contains(@class,"ant-select-item")][./div[contains(@class,"ant-select-item-option-content") and normalize-space()="${optionName}"]]`)
    await optionLocator.scrollIntoViewIfNeeded()
    await optionLocator.click()
}

async function selectDateFunction(page: Page, yyyyMMdd: string, tenPhanDemo: string) {
    const dateFormat = parse(yyyyMMdd, 'yyyy-MM-dd', new Date())
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // validate 
    if (!isValid(dateFormat)) {
        throw new Error('Date không hợp lệ');
    }
    if (dateFormat > today) {
        throw new Error('Ngày được chọn không thể là tương lai')
    }

    // chọn tháng/năm
    await moDropDown(page, tenPhanDemo, 1)
    await chonOption(page, monthNames[dateFormat.getMonth()])

    await moDropDown(page, tenPhanDemo, 2)
    await chonOption(page, String(dateFormat.getFullYear()))

    //check kết quả
    const month = monthNames[dateFormat.getMonth()]
    const year = String(dateFormat.getFullYear())
    const expectText = `${month} ${year}`
    const ketQuaLocator = page.locator('#dp2-month-year')
    await expect(ketQuaLocator).toContainText(expectText)

    // chọn ngày
    await page.locator(`xpath=//tr//td[@data-date="${yyyyMMdd}"]`).click()
    const selectedDate = page.locator('//span[@id="dp2-selected"]')
    await expect(selectedDate).toHaveText(`${yyyyMMdd}`)
}

test('Chọn một ngày trong bảng demo 2', async ({ page }) => {

    await page.goto('https://demoapp-sable-gamma.vercel.app/');

    await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click();
    await page.getByText('📅 jQuery Date Picker', { exact: true }).click();

    const yyyy = '2025'
    const MM = '03'
    const dd = '12'
    const selectyyyyMMdd:string = `${yyyy}-${MM}-${dd}`
    await selectDateFunction(page, selectyyyyMMdd, "Demo 2: Dropdown Navigation + Today highlight + Disable future dates")
});

// const monthNames = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ];

// async function openAntSelectedByCardTitle(page: Page, cardTitle: string, index: number) {
//     const card = page.locator(
//         `xpath=//div[contains(@class,"ant-card-bordered")][.//div[contains(@class, "ant-card-head-title") and normalize-space()="${cardTitle}"]]`
//     )
//     const selects = card.locator(
//         `xpath = .//div[contains(@class, "ant-select-selector")]`
//     )
//     const selecter = selects.nth(index - 1)
//     await selecter.click()
//     const dropdown = selecter.locator('.ant-select-dropdown:visible').first()
//     return dropdown
// }

// async function pickAntOptionByText(page: Page, text: string) {
//     const option = page.locator(
//         `//div[contains(@class,"ant-select-dropdown")]//div[contains(@class,"ant-select-item-option-content") and normalize-space()="${text}"]`
//     )
//     await option.scrollIntoViewIfNeeded()
//     await option.click()
// }

// async function selectDateDemo2(page: Page, ymd: string) {
//   const monthYearText = page.locator('#dp2-month-year');

//   //validate input
//   const parsed = parse(ymd, 'yyyy-MM-dd', new Date());
//   if (!isValid(parsed)) {
//     throw new Error('Ngay khong hop le', ymd);
//   }

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   if (parsed > today) {
//     throw new Error('Khong the chon ngay tuong lai', ymd);
//   }

//   const demo2Title = 'Demo 2: Dropdown Navigation + Today highlight + Disable future dates';
//   await openAntSelectedByCardTitle(page, demo2Title, 1);
//   await pickAntOptionByText(page, monthNames[getMonth(parsed)]);

//   await openAntSelectedByCardTitle(page, demo2Title, 2);
//   await pickAntOptionByText(page, String(getYear(parsed)));

//   //verify
//   const targetMonthName = monthNames[getMonth(parsed)];
//   const targetYear = getYear(parsed);
//   const expecText = `${targetMonthName} ${targetYear}`;
//   await expect(monthYearText).toHaveText(expecText);

//   //tim ngay
//   const dayCell = page.locator(`//table[@id='dp2-table']//td[@data-date='${ymd}']`);
//   await dayCell.click();
//   await expect(page.locator('#dp2-selected')).toHaveText(ymd);
// }
// test('ví dụ date picker2', async ({ page }) => {
//     await page.goto('https://demoapp-sable-gamma.vercel.app/');

//     await page.getByRole('link', { name: 'Bài 4: Mouse Actions' }).click();
//     await page.getByText('📅 jQuery Date Picker', { exact: true }).click();
//     const lastMonth = new Date();
//     lastMonth.setMonth(lastMonth.getMonth() - 1);
//     const y = lastMonth.getFullYear();
//     //yyyy/mm/dd
//     //020304050607
//     const m = String(lastMonth.getMonth() + 1).padStart(2, '0');
//     const d = '15';
//     const ymd = `${y}-${m}-${d}`;
//     await selectDateDemo2(page, ymd);
// });
// setTimeout(() => {
//     debugger;
// }, 5000);


