import { test as base} from '@playwright/test'

// Giả lập database chung
const databaseChung: string[] = []

// Định nghĩa TYPE hay là menu mà con robot sẽ phục vụ
type DatabaseFixture = {
    addAdminUser: string[]
}

// Viết extend -> Dạy robot cách học
export const test = base.extend<DatabaseFixture>({
    addAdminUser: async ({},use) => {
        //GD1: Setup
        console.log(`[SETUP] Thêm user admin`);
        databaseChung.push('Admin')

        //GD2: handover
        await use(databaseChung)

        //GD3: Teardown
        console.log('[Tear Down] Đang dọn dẹp ... xóa admin khỏi DB');
        
        databaseChung.pop()

        console.log('[Tear Down] Hiện tại DB có: ', databaseChung);
    }
})