import {test } from '@playwright/test'

test('Check env', async ({page})=> {
    const projectName = process.env.PROJECT_NAME

    const url = process.env.BASE_URL

    const password = process.env.ADMIN_PASSWORD

    console.log(`Project đang test: ${projectName}`);

    console.log(`URL đang test: ${url}`);

    console.log(`Mật khẩu đang dùng: ${password}`);

    if(url) await page.goto(url)
})