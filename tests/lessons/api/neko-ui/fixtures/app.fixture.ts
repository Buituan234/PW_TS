import { Fixtures, PlaywrightTestArgs } from '@playwright/test';
import { AuthFixtures } from './auth.fixture';
import { ProductPage } from '../pom/ProductPage';
import { OrdersPage } from '../pom/OrderPage';

export type AppFixtures = {
  productPage: ProductPage;
  ordersPage: OrdersPage;
};

type AppDeps = PlaywrightTestArgs & AuthFixtures;

export const appFixtures = {
  productPage: async ({ authedPage }: AppDeps, use: (r: ProductPage) => Promise<void>) => {
    const page = new ProductPage(authedPage);
    await page.goto();
    await use(page);
  },
  ordersPage: async ({ authedPage }: AppDeps, use: (r: OrdersPage) => Promise<void>) => {
    const page = new OrdersPage(authedPage);
    await page.goto();
    await use(page);
  },
};