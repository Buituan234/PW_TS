import { columnMap, createColumnMap } from "../helpers/TableColumnHelpers";
import { BasePage } from "./BasePage";
import { Page, expect } from "@playwright/test";

export class CRMCustomerPage extends BasePage {
    private readonly pageLocators = {
            newCustomerLink: (page: Page) => page.getByRole('link',{name: 'New Customer'}),

            tableHeaders: '#client thead th',
            tableRows: '#client tbody tr',
            searchInput: '#client_filter input[type="search"]',
            tableProcessing: '#client_processing'
    } as const

    public element = this.createLocatorGetter(this.pageLocators)
    
    async expectOnPage(): Promise<void> {
        expect(this.element('newCustomerLink')).toBeVisible()
    }

    async waitForTableReady(){
        const processing = this.element('tableProcessing')
        await expect(processing).not.toBeVisible()

        const headers = this.element('tableHeaders')
        await expect(headers).toBeVisible()
    }

    private async buildColumnMap(): Promise<columnMap>{
        const headers = this.element('tableHeaders')
        return createColumnMap(headers)
    }

    async clickAddNewCustomer(){
        await this.clickwithlog(this.element('newCustomerLink'))
    }
}