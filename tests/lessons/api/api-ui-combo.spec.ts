import { loadFromFolder } from './file-upload.util';
import { test, expect } from './fixtures/gatekeeper.api.fixture';

test.describe('Product Service Test - PUT và PATCH', () => {
  test('TC01. Tạo product bằng API + verify trên UI', async ({ productService, page }) => {
    //B1: Đăng nhập bằng UI
    await page.goto('https://coffee.autoneko.com/login');
    await page.getByPlaceholder('Nhập email hoặc tên đăng nhập').fill('test2');
    await page.getByPlaceholder('Nhập mật khẩu').fill('123456789');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await expect(page.getByRole('button', { name: 'Tiếp tục' })).toBeVisible();
    await page.getByRole('button', { name: 'Tiếp tục' }).click();
    const uniqueName = `Test Coffee ${Date.now()}`;
    //B2: Tạo sản phẩm bằng API
    const product = await productService.createProduct({
      name: uniqueName,
      type: 'bean',
      price_per_unit: 20000,
      unit_type: 'kg',
      specifications: {
        region: 'Bani Mattar',
        altitude: '2,000 - 2,400m',
        processing: 'Natural (Dried on rooftops)',
        grade: 'Mattari',
        flavor_profile: {
          acidity: 7.0,
          bitterness: 4.0,
          sweetness: 7.5,
          floral: 5.0,
          notes: ['Rượu vang đỏ', 'Sô-cô-la', 'Gia vị', 'Nho khô'],
        },
        grind_options: ['whole', 'filter'],
        weight_options: [100, 250],
      },
    });

    const testProductId = product.id;
    console.log('Created test product', testProductId);

    //B3: Verify bằng UI

    await page.goto('https://coffee.autoneko.com/products');
    const productCard = page.getByText(uniqueName);

    await expect(productCard.first()).toBeVisible({ timeout: 10000 });
    // await page.pause();
  });
})