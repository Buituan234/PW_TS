import { test, expect } from '@playwright/test';
import { json } from 'node:stream/consumers';

const DEMO_URL = 'https://demoapp-sable-gamma.vercel.app'

test('kiểm tra Get text', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 3: Tổng hợp Text Methods' }).click()

    //textContent
    const parent = page.locator('#demo-element-1')
    const text1 = await parent.textContent()
    console.log('text1: ', text1)

    //innerText
    const text2 = await parent.innerText()
    console.log('text2: ', text2);

    //innerHTML
    const text3 = await parent.innerHTML()
    console.log('text3: ', text3);

    await page.pause()
});

test('kiểm tra all text', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 3: Tổng hợp Text Methods' }).click()

    //alltextContent
    const parent = page.locator('#demo-dropdown option')
    const allText = await parent.allTextContents()
    console.log('allText: ', allText)

    //allinnertext
    const allInnerText = await parent.allInnerTexts()
    console.log('allInnertext: ', allInnerText);

    // const innerThongThuong = await parent.innerText()
    // console.log('inner thông thường: ', innerThongThuong);

    const listItem = page.locator('#demo-list-item')
    const listAllInnerText = await listItem.allInnerTexts()
    console.log(listAllInnerText);

    await page.pause()
});

test('kiểm tra inputvalue()', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 3: Tổng hợp Text Methods' }).click()

    const inputLocation = page.locator('#demo-input-text')
    const inputValue = await inputLocation.inputValue()

    console.log(inputValue);

    await page.pause()
});

test('kiểm tra getAttribute', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 3: Tổng hợp Text Methods' }).click()

    const inputLocation = page.locator('#demo-attributes')
    const dataStatusAtrribute = await inputLocation.getAttribute('data-status')

    console.log(dataStatusAtrribute);

    await page.pause()
});

//expect không có wait
//toBeValue
// so sang nghiêm ngặt, giống với thằng === ở trong JS TS, nó kiểm tra cả giá trj và kiểu dũ liệu
// phép so sanh cái này có chính xác bằng cái kia không cùng 1 vật thể
test('toBe(value)', () => {
    const name: string = 'playwright'
    const version: number = 1.56
    const isActive: boolean = true

    //Pass
    expect(name).toBe('playwright')
    expect(version).toBe(1.56)
    expect(isActive).toBe(true)

    //Fail
    expect(version).toBe('1.56')

});

//toEqual
//so sánh giá trị nội dung của các object hoặc aray, kiểm tra 2 object hoặc array phải giống hệt nhau
// so sánh 2 cái hộp có chwua thứ giống hệt nhau hay không
test('toEqual', () => {
    const user1 = { id: 1, name: 'A' };
    const user2 = { id: 1, name: 'A' };

    expect(user1).toEqual(user2);
    //expect(user1).toBe(user2) //>> khác vùng biến nhớ trên RAM nên không so sánh được

});

//toContain
//kiểm tra có chứa
test('toContain', () => {
    const fruits = ['Táo', 'Cam', 'Xoài'];
    const user: { id: number, name: string }[] = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
    ]
    //Pass
    expect(fruits).toContain('Cam');

    //Fail
    //expect(fruits).toContain('QUyét')
    expect(user).toContain({ id: 1, name: 'A' }) // Không so sánh được sâu bên trong object có dạng key, value

});

//toContainEqual
// Kiểm tra các mảng có chứa các object
test('toContainEqual', () => {
    const user: { id: number, name: string }[] = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
    ]
    //Pass
    expect(user).toContainEqual({ id: 1, name: 'A' })

});

//toBeTruthy và toBeFalsy
// so sánh nó có true hay false hay không
test('testTruthy và toBeFalsy', () => {
    //Pass
    expect('hello').toBeTruthy()
    expect([]).toBeTruthy()
    expect({}).toBeTruthy()

    expect('').toBeFalsy()
    expect(0).toBeFalsy()
    expect(null).toBeFalsy()
    expect(undefined).toBeFalsy()

});

//toBeGreaterThan / toBeLessThan
test('toBeGreaterThan', () => {
    const itemCount = 5
    const totalPrice = 100.5
    expect(itemCount).toBeGreaterThan(0)
    expect(totalPrice).toBeLessThan(120)
});


//Đề bài: So sánh tên của user là Playwright Learner
test('So sánh tên User', async ({ page }) => {
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 3: Tổng hợp Text Methods' }).click()
    await page.locator('//div[@role="tab" and contains(text(),"Expect Assertions")]').click()
    const userNameLocation = page.locator('#profile-name')
    const userName = await userNameLocation.textContent()
    expect(userName).toBe('Playwright Learner')
});

//Bài 2 : So sánh profile Json có giá trị là
// {
//     "id": 101.
//     "role": "student",
//     "active": true,
//     "premium"
// }
test('Bài 2', async ({ page }) => {
    //có cú pháp  JSON.parse() để chuyển JSOn về object của TS
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 3: Tổng hợp Text Methods' }).click()
    await page.locator('//div[@role="tab" and contains(text(),"Expect Assertions")]').click()
    const jsontext = await page.locator('#profile-json').innerText()
    const jsonOjbect = JSON.parse(jsontext)
    expect(jsonOjbect).toEqual({
        id: 101,
        role: 'student',
        active: true,
        premium: false
})
});

//bài 3: Check category chứa audio và category có đội dài là 3 phần tử
//array.length > trả ra độ dài của mảng
test('Bài 3', async ({ page }) => {
    //có cú pháp  JSON.parse() để chuyển JSOn về object của TS
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 3: Tổng hợp Text Methods' }).click()
    await page.locator('//div[@role="tab" and contains(text(),"Expect Assertions")]').click()
    const categoryType = await page.locator('#categories li').allInnerTexts()
    const soPhanTu = categoryType.length
    expect(categoryType).toContain('🎧 Audio')
    expect(soPhanTu).toBe(3)
});

//bài 4: check trạng thái Instock là true
test('Bài 4', async ({ page }) => {
    //có cú pháp  JSON.parse() để chuyển JSOn về object của TS
    await page.goto(DEMO_URL)
    await page.getByRole('link', { name: 'Bài 3: Tổng hợp Text Methods' }).click()
    await page.locator('//div[@role="tab" and contains(text(),"Expect Assertions")]').click()
    const valueInStock = await page.locator('#in-stock-flag').getAttribute('data-value')
    const valueBoolean = Boolean(valueInStock)
    expect(valueBoolean).toBeTruthy()
});

