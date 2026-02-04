// Bài tập CSS selector
// Câu 1a: Tìm tất cả sản phẩm có discount badge
// Câu 1b: Tìm nút "Add to Cart" của sản phẩm featured (có border vàng)
// Câu 1c: Tìm tất cả sản phẩm out of stock

import { test, expect } from '@playwright/test';
import {performance} from 'node:perf_hooks'

test('Bài tập CSS Selector', async({ page }) => {
    await page.goto('https://demoapp-sable-gamma.vercel.app')
    await page.getByRole('link', {name: 'Bài 2: Playwright Locators'}).click()
    await page.getByRole('button', {name: 'CSS Selector'}).click()
    await page.getByRole('button', {name: 'Bài tập'}).nth(1).click()

    // Câu 1a: Tìm tất cả sản phẩm có discount badge
    await page.locator('.product-grid .discount-badge')

    // Câu 1b: Tìm nút "Add to Cart" của sản phẩm featured (có border vàng)
    await page.locator('.product-card.featured.btn-primary.add-cart')

    // Câu 1c: Tìm tất cả sản phẩm out of stock
    await page.locator('.product-grid.stock-status.out-of-stock')

    //Câu 2a: Tìm tất cả rows có status "inactive"
    await page.locator('.user-row.inactive')

    //Câu 2b: Tìm nút "Delete" của user có ID "002"
    await page.locator('.user-row[data-user-id="002"].btn-delete')

    //Câu 2c: Tìm row cuối cùng trong table body
    await page.locator('.user-row:last-child')
});''