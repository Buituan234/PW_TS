import { Locator, Page } from "@playwright/test";

export class SidebarMenu {
    private readonly sidebar: Locator
    private readonly menuItems: Locator
    private readonly page: Page

    constructor(page: Page){
        this.page = page
        this.sidebar = page.locator('#menu.sidebar')
        this.menuItems = this.sidebar.locator('ul.nav.metis-menu > li')
    }
    private getMenuItemByText(text: string): Locator {
        return this.menuItems.filter({has: this.page.locator('span.menu-text', {hasText: text})})
    }
    async clickMenuItem(menuText: string): Promise<void>{
        console.log(`[SideBarMenu] Click menu item: ${menuText}`);
        const menuItem = this.getMenuItemByText(menuText)
        await menuItem.locator('a').click()
    }
}