import { Locator, Page } from "@playwright/test";

export class CommonHelpers {
    constructor (private page: Page){}

    async selectBootstrapOption(button: Locator, text: string){
        await button.click()
        const option = this.page
        .locator('//a[@role="option"]')
        .filter({has: this.page.locator('span.text', {hasText: text})})
        if (await option.count()){
            await option.click()
            return
        }
        // Đề phòng nếu như mà getByFilter không được
        await this.page.locator(`//a[normalize-space(.)="${text}"]`).first().click()
    }
}