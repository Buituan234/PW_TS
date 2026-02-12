import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
    constructor(protected page: Page) { }
    protected async logClick(locator: Locator) {
        const elementInfo = await this.getElementInfo(locator)
        console.log(`[Click] ${elementInfo}`);

    }
    protected async logfill(locator: Locator, value?: string) {
        const elementInfo = await this.getElementInfo(locator)
        const valueInfo = value ? ` with value: ${value}` : ''
        console.log(`[Fill] ${elementInfo}${valueInfo}`);

    }

    protected async clickwithlog(locator: Locator, option?: Parameters<Locator['click']>[0]) {
        await this.logClick(locator)
        await locator.click()
    }

    protected async fillwithlog(
        locator: Locator,
        value: string,
        options?: {
            isSensitive?: boolean
            fillOption?: Parameters<Locator['fill']>[1]
        }) {
        let isSensitive = options?.isSensitive
        const logValue = isSensitive ? '******' : value
        await this.logfill(locator, logValue)
        await locator.fill(value, options?.fillOption)
    }

    private async getElementInfo(locator: Locator): Promise<string> {
        let text = ''
        try {
            text = await locator.innerText()
            text = text.trim()
        } catch {
            try {
                const textContent = await locator.textContent()
                text = textContent?.trim() || ''
            } catch {
                try {
                    const value = await locator.inputValue()
                    if (value) {
                        text = `value=${value}`
                    }
                } catch { }
            }
        }

        return text
    }
    protected get<T extends Record<string, string | ((page: Page) => Locator)>>(
        locatorMap: T,
        locatorName: keyof T
    ): Locator {
        const locatorDef = locatorMap[locatorName]
        if (typeof locatorDef === 'function') {
            return locatorDef(this.page)
        }
        return this.page.locator(locatorDef)
    }

    protected createLocatorGetter<T extends Record<string, string | ((page: Page) => Locator)>> (
        locatorMap: T
    ): (locator: keyof T) => Locator {
        return (locatorName: keyof T): Locator => {
            const locatorDef = locatorMap[locatorName]
        if(typeof locatorDef === 'function'){
            return locatorDef(this.page)
        }
        return this.page.locator(locatorDef)
        }
    }
    
    abstract expectOnPage(): Promise<void>
}