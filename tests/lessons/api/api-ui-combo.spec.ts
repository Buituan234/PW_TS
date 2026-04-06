import { loadFromFolder } from './file-upload.util';
import { test, expect } from './fixtures/gatekeeper.api.fixture';
import { ProductService } from './services/ProductService';

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
  test('TC02. Upload ảnh với độ trễ', async({ productService, page}) => {
    test.setTimeout(120000);
    const Base_URL = 'https://coffee.autoneko.com'
    //B1: Đăng nhập bằng UI
    await page.goto('https://coffee.autoneko.com/login');
    await page.getByPlaceholder('Nhập email hoặc tên đăng nhập').fill('test2');
    await page.getByPlaceholder('Nhập mật khẩu').fill('123456789');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await expect(page.getByRole('button', { name: 'Tiếp tục' })).toBeVisible();
    await page.getByRole('button', { name: 'Tiếp tục' }).click();
    
    
    //B2: Lấy ID sản phẩm bằng API
    const products = await productService.getProducts({limit: 1})
    const productId = products.data[0].id

    //B3: Verify bằng UI
    await page.goto(`${Base_URL}/upload/${productId}`)
    await expect(page.locator('h1')).toBeVisible()
    await page.getByText('Mô phỏng độ trễ (Demo)').click()
    await page.locator('input[type="number"]').fill('20')

    const image = loadFromFolder('2.jpg', 'files')
    const fileInput = page.locator('input[type="file"]');
    // https://uploads-neko-coffee.autoneko.com/api/products/63/image?delay=120

    const uploadStartTime = Date.now();

    const [uploadResponse] = await Promise.all([
      page.waitForResponse(
        (resp) => {
          const url = resp.url();
          const match =
            url.includes('/api/products/') && url.includes('/image') && resp.status() === 200;
          console.log(`waitForResponse ${resp.request().method()} ${url} -> match`);
          return match;
        },
        { timeout: 70000 }
      ),

      fileInput.setInputFiles({
        name: image.name,
        mimeType: image.mimeType,
        buffer: image.buffer,
      }),
    ]);

    const uploadDuration = (Date.now() - uploadStartTime) / 1000;

    console.log(`Response recevied after ${uploadDuration.toFixed(1)}s`);

    expect(uploadResponse.status()).toBe(200);
    const resBody = await uploadResponse.json();
    console.log(resBody);

    expect(uploadDuration).toBeGreaterThan(0);

  })
})