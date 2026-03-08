import { test as base} from '@playwright/test'

export type ElectricityFixture = {
    nguonDien: number,
    oCam: string,
    denBan: string
}

export const test = base.extend<ElectricityFixture>({
    // Mắt xích 1: Nguổn điện
    nguonDien: async({}, use) => {
        console.log('[1]. Đóng cầu giao diện. có điện về bản!!');
        const vol = 220
        await use(vol)
        console.log('[1]. Ngắt cầu dao điện');
    },

    // Mắt xích 2: Trung gian (ổ cắm)
    oCam: async({nguonDien}, use) => {
        console.log(`[2]. O cắm nối vào nguồn ${nguonDien}`);
        const loaiO = 'O lioa'

        await use(loaiO)
        console.log('[2]. Rút phích cắm khỏi ổ')
    },
    // Mắt xích 3
    denBan: async ({ oCam }, use) => {
        console.log(`[3]. Đèn cắm vào ổ ${oCam} và bật đèn`);
        const trangThai = 'Đèn đang sáng'
        await use(trangThai)
        console.log('[3]. Tắt đèn');
    }
})