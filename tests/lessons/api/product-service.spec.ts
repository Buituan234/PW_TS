import { test, expect } from './fixtures/gatekeeper.api.fixture'
import { ProductService } from './services/ProductService'

test.describe('Product Service Test', () => {
    test('TC01. Get product list', async ({ productService }) => {
    const response = await productService.getProducts({ limit: 5 })
    console.log('Total', response.pagination.total_items);
    console.log('Products', response.data.length);
    })
})