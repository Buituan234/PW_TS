import { SidebarMenu } from "../components/SidebarMenu";
import { BasePage } from "./BasePage";
import { Page, expect } from "@playwright/test";

export class CRMDashboardPage extends BasePage {
    readonly sidebarMenu = new SidebarMenu(this.page)
    private readonly pageLocators = {
        logo: '#logo',
        // Search input
        searchInput: (page: Page)=> page.getByRole('searchbox', {name: 'Search'}),
        dashboardLink: (page: Page) => page.getByRole('link', {name: 'Dashboard'})
    }
    public element = this.createLocatorGetter(this.pageLocators)
    
    async expectOnPage(): Promise<void> {
        expect(this.element('logo')).toBeVisible
        expect(this.get(this.pageLocators, 'searchInput')).toBeVisible
        expect(this.element("dashboardLink")).toBeVisible
    }
    async navigateMenu(menuText: string){
        await this.sidebarMenu.clickMenuItem(menuText)
    }
}