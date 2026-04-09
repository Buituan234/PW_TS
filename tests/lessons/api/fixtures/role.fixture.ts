import {test as base, BrowserContext, Page} from '@playwright/test'

type RoleName = 'admin' | 'staff'

type AsRoleFunction = (role: RoleName) => Promise<Page>

export const test = base.extend<{asRole: AsRoleFunction}>({
    asRole: async ({browser}, use) => {
        let contexts: BrowserContext[] = []
        const createRolePage = async (role: RoleName): Promise<Page> => {
            const storageStatePath = `./auth/${role}.setup.json`
            const context = await browser.newContext({
                storageState: storageStatePath
            })
            contexts.push(context)
            const page = await context.newPage()
            return page
        }
        //Sử dụng cho khách hàng
        await use(createRolePage)

        console.log('Dọn dẹp context');
        for (const context of contexts){
            await context.close()
        }
        
    }
})

export { expect } from '@playwright/test'