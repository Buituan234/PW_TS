import { test as base, Page } from '@playwright/test';

export type AuthFixtures = {
  authedPage: Page;
};

export const auth = base.extend<AuthFixtures>({
  authedPage: async ({ page }, use) => {
    await use(page);
  },
});