import { test as base } from "@playwright/test";
// Món này trả về cái gì
export type KitchenMenu = {
    phoBo: string,
    banhMi: string
}

// Công thức pha chế
export const testKitchen = base.extend<KitchenMenu>({
    phoBo: async({}, use) => {
        console.log('Bếp đang chan nước lèo');
        const monAn = 'Phở bò tái nạm'
        await use(monAn)
    },
    banhMi: async({}, use) => {
        console.log('Bếp đang nướng bánh mỳ');
        const monAn = 'Bánh mỳ bate'
        await use(monAn)
    }
})