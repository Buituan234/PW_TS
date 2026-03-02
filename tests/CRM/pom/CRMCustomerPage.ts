import {
    columnMap,
    createColumnMap,
    getColumnValuesSimple,
    ColumnTextCleaner,
    getTableDataSimple,
    findRowByColumnValueSimple,
    TextMatcher
} from "../helpers/TableColumnHelpers";
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

export const DEFAULT_CUSTOMER_TABLE_COLUMNS: CustomerColumnKey[] = [
    'company',
    'primaryContact',
    'primaryEmail',
    'phone',
    'active',
    'groups',
    'dateCreated',
] as const;

export class CRMCustomerPage extends BasePage {

    private columnMapCache: columnMap | null = null

    private readonly pageLocators = {
        newCustomerLink: (page: Page) => page.getByRole('link', { name: 'New Customer' }),

        tableHeaders: '#clients thead th',
        tableRows: '#clients tbody tr',
        searchInput: '#clients_filter input[type="search"]',
        tableProcessing: '#clients_processing'
    } as const

    public element = this.createLocatorGetter(this.pageLocators)

    async expectOnPage(): Promise<void> {
        expect(this.element('newCustomerLink')).toBeVisible()
    }

    private getRowsLocator(): Locator {
        return this.element('tableRows')
    }

    async waitForTableReady() {
        const processing = this.element('tableProcessing')
        await expect(processing).not.toBeVisible()

        const headers = this.element('tableHeaders')
        await expect(headers.first()).toBeVisible()

        const rows = this.getRowsLocator()
        await expect(rows.nth(0)).toBeVisible()
    }

    private async buildColumnMap(): Promise<columnMap> {
        const headers = this.element('tableHeaders')
        return createColumnMap(headers)
    }

    async clickAddNewCustomer() {
        await this.clickwithlog(this.element('newCustomerLink'))
    }

    private async ensureColumnMapCache(): Promise<columnMap> {
        if (!this.columnMapCache) {
            await this.waitForTableReady()
            this.columnMapCache = await createColumnMap(this.element('tableHeaders'))
        }
        return this.columnMapCache
    }
    async getRowCount(): Promise<number> {
        await this.waitForTableReady()
        return this.getRowsLocator().count()
    }

    private get columnCleaner(): Record<string, ColumnTextCleaner> {
        return {
            company: async (cell: Locator) => {
                const linkText = await cell.locator('a').first().textContent();
                if (linkText && linkText.length > 0) {
                    return linkText;
                }
                //abcView delete....
                const raw = ((await cell.textContent()) || '').trim();
                const actionIndex = raw.indexOf('View');
                return actionIndex > 0 ? raw.slice(0, actionIndex).trim() : raw;
            },
        };
    }

    async getColumnValues(columnKey: CustomerColumnKey | string) {
        await this.waitForTableReady()
        const columnMap = await this.ensureColumnMapCache()
        return getColumnValuesSimple(
            this.element('tableHeaders'),
            this.getRowsLocator(),
            columnKey,
            this.columnCleaner,
            columnMap
        );
    }

    async getTableData(
    coloumnKeys: Array<CustomerColumnKey | string>
  ): Promise<Array<Record<string, string>>> {
    await this.waitForTableReady();
    const coloumnMap = await this.ensureColumnMapCache();
    return getTableDataSimple(
      this.element('tableHeaders'),
      this.getRowsLocator(),
      coloumnKeys,
      this.columnCleaner,
      coloumnMap
    );
  }

    async findRowByColumnValue(
    columnKey: CustomerColumnKey | string,
    matcher: TextMatcher
  ): Promise<Locator> {
    await this.waitForTableReady();
    const coloumnMap = await this.ensureColumnMapCache();
    return findRowByColumnValueSimple(
      this.element('tableHeaders'),
      this.getRowsLocator(),
      columnKey,
      matcher,
      this.columnCleaner,
      coloumnMap
    );
  }
}