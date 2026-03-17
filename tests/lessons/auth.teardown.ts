import { test as teardown } from '@playwright/test';

teardown('Dọn dẹp Database', async ({ }) => {
  console.log('🔴 [TEARDOWN] 🧹 Đang xóa User khỏi Database...');
  // Giả lập gọi API xóa user
  console.log('🔴 [TEARDOWN] ✅ Dọn dẹp hoàn tất!');
});