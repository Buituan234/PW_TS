import { loadFromFolder } from './file-upload.util';
import { test, expect } from './fixtures/gatekeeper.api.fixture'
import { ProductService } from './services/ProductService';

// test.describe('Product Service Test', () => {
//     test('TC01. Get product list', async ({ productService }) => {
//         const response = await productService.getProducts({ limit: 5 })
//         console.log('Total', response.pagination.total_items);
//         console.log('Products', response.data.length);
//         console.log('All product', response.data);
//     })
// })
// Viết test case TC02: get products với pagination dựa vào productService
// Viết test case TC03: get chi tiết 1 product

// Ý tưởng là mình sẽ tạo ra 1 sản phẩm chỉ dành riêng để PUT và PATCH > Dùng xong xóa luôn

test.describe('Product Service Test PUT và Patch', () => {
    let testProductID: number;
    test.beforeEach(async ({ productService }) => {
        const response = await productService.createProduct({
            name: `Tets PUT - PATCH ${Date.now()}`,
            type: 'bean',
            price_per_unit: 20000,
            unit_type: 'kg',
            specifications: {
                region: "Bani Mattar",
                altitude: "2,000 - 2,400m",
                processing: "Natural (Dried on rooftops)",
                grade: "Mattari",
                flavor_profile: {
                    acidity: 7.0,
                    bitterness: 4.0,
                    sweetness: 7.5,
                    floral: 5.0,
                    notes: [
                        "Rượu vang đỏ",
                        "Sô-cô-la",
                        "Gia vị",
                        "Nho khô"
                    ]
                },
                grind_options: [
                    "whole",
                    "filter"
                ],
                weight_options: [
                    100,
                    250
                ]
            }
        })
        testProductID = response.id
        console.log(`Created product with ID: ${testProductID}`);
    })
    test.afterEach(async ({ productService }) => {
        console.log('Deleted test product: ',testProductID);
        await productService.deleteProduct(testProductID)
    })
    test('Cập nhật toàn bộ product (Đầy dủ required field', async ({ productService }) => {
        const updateProduct = await productService.updateProduct(testProductID, {
            name: `PUT updated${Date.now()}`,
            type: 'bean',
            price_per_unit: 60000,
            unit_type: 'kg',
            specifications: {
                region: "Bani Mattar",
                altitude: "2,000 - 2,400m",
                processing: "Natural (Dried on rooftops)",
                grade: "Mattari",
                flavor_profile: {
                    acidity: 7.0,
                    bitterness: 4.0,
                    sweetness: 7.5,
                    floral: 5.0,
                    notes: [
                        "Rượu vang đỏ",
                        "Sô-cô-la",
                        "Gia vị",
                        "Nho khô"
                    ]
                },
                grind_options: [
                    "whole",
                    "filter"
                ],
                weight_options: [
                    100,
                    250
                ]
            }
        })
        expect(updateProduct.id).toBe(testProductID)
        expect(updateProduct.price_per_unit).toBe(60000)
    })
    test('Cập nhật giá sản phẩm qua PATCH', async({ productService}) => {
        const patched = await productService.patchProduct(testProductID, {
            price_per_unit: 3000000,
        })
        expect(patched.price_per_unit).toBe(3000000)
    })
})

// race condition: 1 sản phẩm bị cả put và patch tác động
// Trường hợp xảy ra nếu sử dụng before all và after all là khi 2 worker nhận 2 test case độc lập với nhau
// thì sẽ làm bẩn biến let testProductID khi mà mỗi lần before All thì mỗi worker tạo ra 1 item khác nhau từ đó
// ID của test case A có thể bị đè bởi testProductID của test case B > nên sử dụng beforeEach cho an toàn

// soft assertion: có thể chạy check tiếp các assertion khác khi mà có expect bị fail trước đó
test('TC01. Hard assertion - Dừng ngay khi fail', async ({ productService}) => {
    const respone = await productService.getProduct(1)
    expect(respone.id).toBe(2)
    expect(respone.name).toBeTruthy()
})

test('TC02. Soft assertion - tiếp tục khi fail', async ({ productService}) => {
    const respone = await productService.getProduct(2)
    console.log('Assertion 1:  id = 999 sẽ fail');
    expect.soft(respone.id,'id muốn là  999').toBe(999)

    console.log('Assertion 2: name === xyz sẽ là fail');
    expect.soft(respone.name, 'name muốn là xyz').toBe('xyz')

    console.log('Assertion 3: price > 0 sẽ là pass');
    expect.soft(respone.price_per_unit, 'price muốn  > 0 sẽ là pass').toBeGreaterThan(0)

    console.log('Assertion 4: type === xxx sẽ là fail');
    expect.soft(respone.type, 'type muốn  === xxx').toBe('xxx')
})

test('TC03. Upload ảnh cho sản phẩm', async ({ productService})=> {
    const list = await productService.getProducts({limit: 1})
    const productId = list.data[0].id
    console.log(`Product id: ${productId}`);
    

    const imageFile = loadFromFolder('2.jpg','files')
    const UPLOAD_SERVER = 'https://uploads-neko-coffee.autoneko.com'
    const result = await productService.uploadImage(productId, imageFile, UPLOAD_SERVER)
    console.log(result.message);
    console.log(result.image_url);
})
