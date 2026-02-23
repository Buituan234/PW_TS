import { BasePage } from "./BasePage";
import { Page, expect } from "@playwright/test";

export class CRMCustomerPage extends BasePage {
    private readonly pageLocators = {
            newCustomerLink: (page: Page) => page.getByRole('link',{name: 'New Customer'})
    } as const

    public element = this.createLocatorGetter(this.pageLocators)
    
    async expectOnPage(): Promise<void> {
        expect(this.element('newCustomerLink')).toBeVisible()
    }
    async clickAddNewCustomer(){
        await this.clickwithlog(this.element('newCustomerLink'))
    }
}