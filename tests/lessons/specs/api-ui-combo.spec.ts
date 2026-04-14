import { test, expect } from '../fixtures/unified.fixture';

test('TC_01: Full combo, API + UI fixture', async ({ productService, productPage }) => {
  //1. UI get products
  const uiCount = await productPage.getProductCount();
  console.log(`UI ${uiCount} products`);
  expect(uiCount).toBe(12);
  //2 API. get products
  const response = await productService.getProducts();
  const apiCount = response.data.length;
  console.log(`API ${apiCount} products`);
  expect(apiCount).toBe(10);
});