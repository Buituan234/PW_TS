import { test as base } from "@playwright/test";
// Món này trả về cái gì
export type BarMenu = {
    traSua: string,
    cafeDen: string
}

// Công thức pha chế
export const testBar = base.extend<BarMenu>({
    traSua: async({}, use) => {
        console.log('Bar đang lắc trà sữa');
        const monAn = 'Trà sữa chân châu đường đen'
        await use(monAn)
    },
    cafeDen: async({}, use) => {
        console.log('Bar đang pha cà phê');
        const monAn = 'CF đen Sài Gòn'
        await use(monAn)
    }
})