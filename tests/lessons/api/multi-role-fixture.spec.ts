import { test, expect } from './fixtures/role.fixture'

test('TC01. Admin can see the customers, Staff CANNOT', async ({ asRole }) => {

    const adminPage = await asRole('admin')

    const staffPage = await asRole('staff')

    await adminPage.goto('/admin/users')
    await adminPage.waitForLoadState('domcontentloaded')

    await staffPage.goto('/admin/users')
    await staffPage.waitForLoadState('domcontentloaded')

    await adminPage.pause()
    await staffPage.pause()
})
test('TC02. Admin và Manager chat realtime với nhau', async ({ asRole }) => {
    const adminPage = await asRole('admin')
    const managerPage = await asRole('staff')

    await Promise.all([adminPage.goto('/chat'), managerPage.goto('/chat')])
    await Promise.all([
        adminPage.waitForLoadState('domcontentloaded'),
        managerPage.waitForLoadState('domcontentloaded')
    ])
    
    // Manager nhắn tin cho admin
    await managerPage.getByPlaceholder('Nhập User ID...').fill('1')
    await managerPage.locator('button[data-testid="chat-button-new-chat"]').click()
    await expect(managerPage.locator('//div[@data-testid="chat-area"]/div').nth(0)).toContainText('User #1')
    await expect(managerPage.getByPlaceholder('Nhập tin nhắn... (Shift+Enter để xuống dòng)')).toBeVisible()
    const message = "Hello Admin"
    await managerPage.getByPlaceholder('Nhập tin nhắn... (Shift+Enter để xuống dòng)').fill(message)
    await managerPage.locator('//button[@type="submit"]').click()

    await expect(adminPage.locator('//div[@class="relative group"]/button/span').nth(2)).toContainText('1')
    await adminPage.locator('//div[@class="relative group"]/button').hover()
    await expect(adminPage.locator('//div[@class="relative group"]/div//a[@href="/chat"]//div').nth(1)).toContainText(message)
})
