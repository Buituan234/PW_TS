// 1 Nhập con robot về 
// 2 dạy robot công thức (fixture)
// 3 Gọi món để kiểm tra (test)

//Bước 1: 
import { test as base} from '@playwright/test'

//Bước 2: Dạy robot (định nghĩa fixture)
//Mở rộng extend bộ não robot gốc

export const test = base.extend<{
    loiChao: string
}>({
    // Tên món: Lời chào

    // Món này siêu dễ làm không cần nguyên liệu

    loiChao: async ({ page }, use) => {
        await page.goto('http://playwright.dev')
        //1 Chế biến: set up làm trong bếp
        const text = await page.title()
        //2. Đưa món (Bưng ra bàn)

        //Robot đưa text cho KH và chờ
        await use(`Xin chào bạn đang trang ${text}`)
    }
})