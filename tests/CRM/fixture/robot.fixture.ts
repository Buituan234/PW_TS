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
        // GDD1: 
        await page.goto('http://playwright.dev')
        //1 Chế biến: set up làm trong bếp
        const text = await page.title()
        //2. Đưa món (Bưng ra bàn)

        //Robot đưa text cho KH và chờ
        // GDd2: Chạy tới await use() > Stop > Trao quyền điều khiển sân chơi cho file test
        await use(`Xin chào bạn đang trang ${text}`)

        // GDD3: dù test có chạy pass hay fail => teardowm
    }
})