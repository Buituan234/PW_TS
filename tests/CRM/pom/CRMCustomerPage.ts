import { columnInfo, columnMap, createColumnMap } from "../helpers/TableColumnHelpers";
import { BasePage } from "./BasePage";
import { Locator, Page, expect } from "@playwright/test";

export type CustomerColumnKey =
  | 'select' // Cột checkbox (đầu tiên)
  | 'rowNumber' // Cột # (số thứ tự)
  | 'company' // Tên công ty
  | 'primaryContact'
  | 'primaryEmail'
  | 'phone'
  | 'active'
  | 'groups'
  | 'dateCreated';

export class CRMCustomerPage extends BasePage {

    private  columnMapCache: columnMap | null = null

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

    private getRowsLocator(): Locator{
        return this.element('tableRows')
    }

    async waitForTableReady(){
        const processing = this.element('tableProcessing')
        await expect(processing).not.toBeVisible()

        const headers = this.element('tableHeaders')
        await expect(headers).toBeVisible()

        const rows = this.getRowsLocator()
        await expect(rows.nth(0)).toBeVisible()
    }

    private async buildColumnMap(): Promise<columnMap>{
        const headers = this.element('tableHeaders')
        return createColumnMap(headers)
    }

    async clickAddNewCustomer(){
        await this.clickwithlog(this.element('newCustomerLink'))
    }

    private async ensureColumnMapCache(): Promise<columnMap>{
        if(!this.columnMapCache){
            await this.waitForTableReady()
            this.columnMapCache = await createColumnMap(this.element('tableHeaders'))
        }
        return this.columnMapCache
    }
    async getRowCount(): Promise<number>{
        await this.waitForTableReady()
        return this.getRowsLocator().count()
    }
}