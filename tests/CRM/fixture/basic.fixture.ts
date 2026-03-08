//Bước 1: 
import { test as base } from '@playwright/test'

//Bước 2: Dạy robot (định nghĩa fixture)
//Mở rộng extend bộ não robot gốc

export const test = base.extend<{
    randomNumber: number;
    greeting: string;
    userInfo: { name: string; age: number; email: string }
}>({
    randomNumber: async ({ }, use) => {
        const number = Math.floor(Math.random() * 100) + 1
        // Bưng ra bàn
        await use(number)
    },
    greeting: async({}, use) => {
        const message = 'Hello world'
        await use(message)
    },
    userInfo: async({}, use) => {
        const user = {
            name: 'Teo',
            age: 18,
            email: 'Teo@gmail.com'
        }
        await use(user)
    }
})