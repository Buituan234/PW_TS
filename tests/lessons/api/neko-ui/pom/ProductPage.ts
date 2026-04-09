import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class ProductPage extends BasePage {
  // LOCATORS
  // products-grid
  private readonly productGrid = this.page.locator('[data-testid="products-grid"]');
  private readonly productCards = this.productGrid.locator('>div');

  async goto(): Promise<void> {
    await this.page.goto('/products');
    await expect(this.productCards.first()).toBeVisible();
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/products/);
  }

  async clickProduct(productName: string) {
    const productCard = this.productCards.filter({ hasText: productName });
    return this.clickWithLog(productCard);
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }
}