import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
    constructor(protected page: Page){}
    protected async logClick(locator: Locator){
        const elementInfo = await this.getElementInfo(locator)
        console.log(`[Click] ${elementInfo}`);
        
    }
    protected async logfill(locator: Locator){
        const elementInfo = await this.getElementInfo(locator)
        console.log(`[Fill] ${elementInfo}`);
        
    }
    private async getElementInfo(locator: Locator): Promise<string> {
        const text = await locator.innerText().catch(() => '')
        return text 
    }
    abstract expectOnPage(): Promise<void>
}