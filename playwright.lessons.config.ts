import { chromium, defineConfig, devices } from '@playwright/test';
import dotenvflow from 'dotenv-flow';
import { title } from 'process';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

dotenvflow.config({
  default_node_env: 'development',
});

export default defineConfig({
  testDir: './tests/lessons',
  // globalSetup: './global-setup.ts',
  // globalTeardown: './global-teardown.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    // ['allure-playwright'],
    // ['./custom.ts'],
    // [
    //   'json',
    //   {
    //     outputFile: './data.json',
    //   },
    // ],
    [
      'list',
      {
        printSteps: true,
      },
    ],
    ['html'],
  ],

  use: {
    baseURL: 'https://crm.anhtester.com',
    trace: 'on',
    headless: false,
    video: 'on-first-retry',
    screenshot: 'off',
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
      teardown: 'cleanup',
    },
    {
      name: 'cleanup',
      testMatch: '**/*.teardown.ts',
    },
    {
      name: 'chromium',
      use: {
        // browserName: '',
        ...devices['Desktop Chrome'],
        storageState: './auth/user.json'
      },
      dependencies: ['setup'],
    },
    {
      name: 'neko-setup',
      use: {
        browserName: 'chromium',
        baseURL: 'https://api-neko-coffee.autoneko.com',
      },
      testMatch: '/api/**/*.setup.ts'
    },
    {
      name: 'neko-api',
      use: {
        browserName: undefined,
        //baseURL: 'https://jsonplaceholder.typicode.com',
        baseURL: 'https://api-neko-coffee.autoneko.com'
      },
      testMatch: '/api/**/*.spec.ts',
      dependencies: ['neko-setup']
    },
    {
      name: 'setup-admin',
      testMatch: '**/auth/admin.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://coffee.autoneko.com/',
      }
    },
    {
      name: 'setup-staff',
      testMatch: '**/auth/staff.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://coffee.autoneko.com/',
      }
    },
    {
      name: 'multi-role',
      testMatch: '**/*.spec.ts',
      dependencies: ['setup-admin', 'setup-staff'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://coffee.autoneko.com/',
      }
    }
    {
      name: 'neko-combined',
      testMatch: '/specs/*.spec.ts',
      dependencies: ['neko-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://coffee.autoneko.com',
        storageState: './auth/admin.json',
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
// api-ui-combo.spec.ts
// demo-scroll.spec.ts
// type DeviceDescriptor = {
//   viewport: ViewportSize;
//   userAgent: string;
//   deviceScaleFactor: number;
//   isMobile: boolean;
//   hasTouch: boolean;
//   defaultBrowserType: 'chromium' | 'firefox' | 'webkit';
// };