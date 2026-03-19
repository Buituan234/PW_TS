import { test } from '@playwright/test';

test('Test 04 (Nhanh)', async ({}, testInfo) => {
  console.log(`🚀 [Worker ${testInfo.workerIndex}] BẮT ĐẦU: 04_fast.spec.ts`);

  // Giả vờ làm việc 2 giây
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`✅ [Worker ${testInfo.workerIndex}] KẾT THÚC: 04_slow.spec.ts`);
});