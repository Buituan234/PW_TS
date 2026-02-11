import { BasePage } from "./BasePage";
import { Page, expect } from "@playwright/test";

export class CRMDashboardPage extends BasePage {
    private readonly pageLocators = {
        logo: '#logo',
        // Search input
        searchInput: (page: Page)=> page.getByRole('searchbox', {name: 'Search', exact: true})
    }
    public element = this.createLocatorGetter(this.pageLocators)
    
    async expectOnPage(): Promise<void> {
        await expect(this.element('logo')).toBeVisible
        await expect(this.get(this.pageLocators, 'searchInput')).toBeVisible
    }
}