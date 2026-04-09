import { test, expect, BrowserContext, Page } from '@playwright/test'

test('TC01. Admin can see the customers, Staff CANNOT', async ({ browser }) => {
    const adminContext = await browser.newContext({
        storageState: './auth/admin.setup.json'
    })

    const adminPage = await adminContext.newPage()

    const staffContext = await browser.newContext({
        storageState: './auth/staff.setup.json'
    })

    const staffPage = await staffContext.newPage()

    await adminPage.goto('/admin/users')
    await adminPage.waitForLoadState('domcontentloaded')

    await staffPage.goto('/admin/users')
    await staffPage.waitForLoadState('domcontentloaded')

    await adminPage.pause()
    await staffPage.pause()

    await adminContext.close()
    await staffContext.close()
})