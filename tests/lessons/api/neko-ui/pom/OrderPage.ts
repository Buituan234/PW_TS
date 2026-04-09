import { BasePage } from './BasePage';
import {
  columnMap,
  ColumnTextCleaner,
  getColumnValuesSimple,
  getTableDataSimple,
} from '../../../../CRM/helpers/TableColumnHelpers'
import { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
export class OrdersPage extends BasePage {
  //locator table
  private readonly table = this.page.locator('table');
  private readonly headers = this.table.locator('thead th');
  private readonly rows = this.table.locator('tbody tr');

  //locator filter

  private readonly statusDropdown = this.page.locator('select').first();

  private columnMapCache: columnMap | null = null;

  private readonly columnCleaner: Record<string, ColumnTextCleaner> = {
    //cột khách hàng có structure
    //
    // <div><p class="text-sm font-bold">Ngô Thị K</p><p class="text-[11px] text-slate-400">customer5@test.com</p></div>

    'khách hàng': async (cell: Locator) => {
      const nameElement = cell.locator('p').first();
      const name = await nameElement.textContent();
      return (name || '').trim();
    },

    ///dahuy expand_more
    'trạng thái': async (cell: Locator) => {
      const button = cell.locator('button');
      const text = await button.innerText();
      return (text || '').replace('expand_more', '');
    },
  };

  async goto(): Promise<void> {
    await this.page.goto('/admin/orders');
    await expect(this.table).toBeVisible();
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin\/orders/);
    await expect(this.rows.first().locator('td').first()).not.toBeEmpty();
  }

  //lấy giá trị của 1 cột
  async getColumnValues(columnKey: string): Promise<string[]> {
    return getColumnValuesSimple(
      this.headers,
      this.rows,
      columnKey,
      this.columnCleaner,
      this.columnMapCache
    );
  }

  //lấy dữ liệu nhiều cột từ table
  async getTableData(coloumnKeys: Array<string>): Promise<Array<Record<string, string>>> {
    return getTableDataSimple(
      this.headers,
      this.rows,
      coloumnKeys,
      this.columnCleaner,
      this.columnMapCache
    );
  }
}