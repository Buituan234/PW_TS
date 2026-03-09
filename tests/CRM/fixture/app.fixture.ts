import { Fixtures, PlaywrightTestArgs } from '@playwright/test';
import { AuthFixtures } from './auth.fixture';

// Import POM
import { CRMDashboardPage } from '../pom/CRMDashboardPage';
import { CRMCustomerPage } from '../pom/CRMCustomerPage';
import { CRMNewCustomerPage } from '../pom/CRMNewCustomerPage';

// 1. MENU
// Lưu ý: loginPage đã có trong AuthFixtures, không cần thêm ở đây
export type AppFixtures = {
  dashboardPage: CRMDashboardPage;
  customersPage: CRMCustomerPage;
  newCustomerPage: CRMNewCustomerPage;
};

// 2. HELPER TYPE (Mẹo để code gọn)
// Định nghĩa: Nguyên liệu cần thiết = Đồ của Playwright + Đồ của Auth
type AppDeps = PlaywrightTestArgs & AuthFixtures;

// 3. LOGIC
//  TẠI SAO KHÔNG DÙNG ': Fixtures<AppFixtures, AppDeps>'?
// 
// Khi bạn dùng: export const appFixtures: Fixtures<AppFixtures, AppDeps> = {...}
// TypeScript sẽ ép kiểu object thành type Fixtures phức tạp của Playwright
// 
// Khi spread: auth.extend({ ...appFixtures })
// TypeScript cần merge 2 Fixtures types:
//   1. Fixtures từ 'auth' (đã có AuthFixtures)
//   2. Fixtures từ 'appFixtures' (cần AuthFixtures & PlaywrightTestArgs)
// 
// Vấn đề: TypeScript không thể tự động merge các Fixtures types phức tạp này
// vì chúng có nhiều generic parameters và conditional types
// 
// GIẢI PHÁP: Bỏ ': Fixtures<...>' đi
// → TypeScript sẽ infer type từ object thuần túy
// → Khi spread, TypeScript merge object properties thay vì Fixtures types
// → Đơn giản hơn và không bị lỗi!

export const appFixtures = {
  
  // 👉 Ta định kiểu trực tiếp vào tham số ({ authedPage }: AppDeps)
  // TypeScript sẽ hiểu ngay mà không bắt bẻ khi merge
  // Lưu ý: loginPage đã được định nghĩa trong auth.fixture.ts
  
  dashboardPage: async ({ authedPage }: AppDeps, use: (r: CRMDashboardPage) => Promise<void>) => {
    const page = new CRMDashboardPage(authedPage)
    await page.expectOnPage()
    await use(page)
  },

  customersPage: async ({ authedPage }: AppDeps, use: (r: CRMCustomerPage) => Promise<void>) => {
    await use(new CRMCustomerPage(authedPage));
  },

  newCustomerPage: async ({ authedPage }: AppDeps, use: (r: CRMNewCustomerPage) => Promise<void>) => {
    await use(new CRMNewCustomerPage(authedPage));
  },
};