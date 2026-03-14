import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch(); // Tự bật browser

  const page = await browser.newPage();

  try {
    await page.goto('https://github.com/login');

    await page.click('input[name="commit-sign-in"]', { timeout: 5000 });

    await page.context().storageState({ path: 'auth.json' });
  } catch (error) {
    console.error(' Login thất bại!');

    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;