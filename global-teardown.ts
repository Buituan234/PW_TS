import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log(`[GLOBAL TEARDOWN] HET GIO LAM VIEC`);
  console.log(`[GLOBAL TEARDOWN] dat tat server ${process.env.DB_CONNECTION_URL}`);
}

export default globalTeardown;