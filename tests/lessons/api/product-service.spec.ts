import { test, expect } from './fixtures/gatekeeper.api.fixture'
import { ProductService } from './services/ProductService'

test.describe('Product Service Test', () => {
    test('TC01. Get product list', async ({ productService }) => {
    const response = await productService.getProducts({ limit: 5 })
    console.log('Total', response.pagination.total_items);
    console.log('Products', response.data.length);
    console.log('All product', response.data);
    })
})
// Viết test case TC02: get products với pagination dựa vào productService
// Viết test case TC03: get chi tiết 1 product