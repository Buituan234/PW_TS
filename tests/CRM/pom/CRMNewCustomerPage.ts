import { BasePage } from "./BasePage";
import { Page, expect } from "@playwright/test";

export interface CustomerInfo {
    company: string,
    vat?: string,
    phone?: string,
    website?: string,
    address?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
    language?: string,
    currency?: string,
}

export class CRMNewCustomerPage extends BasePage {
    private readonly pageLocators = {
        //Input fields
        company: '#company',
        vat: '#vat',
        phone: '#phonenumber',
        website: '#website',
        address: '#address',
        city: '#city',
        state: '#state',
        zip: '#zip',

        //Button

        saveButton: (page: Page)=> page.locator('//div[@id="profile-save-section"]//button[normalize-space()="Save"]'),

        asterik: (page: Page) => page.locator('label', { hasText: 'Company' }).locator('//small[normalize-space()="*"]'),

        currencyButton: (page: Page) => page.locator('//label[@for="default_currency"]//following-sibling::div[contains(@class,"dropdown")]'),

        countryButton: (page: Page) => page.locator('//label[@for="country"]//following-sibling::div[contains(@class,"dropdown")]'),

        languageButton: (page: Page) => page.locator('//select[@id="default_language"]')
    } as const

    public element = this.createLocatorGetter(this.pageLocators)

    async fillCompany(name: string) {
        await this.fillwithlog(this.element('company'), 'name')
    }

    async contactInfo(info: CustomerInfo){
        if (info.vat){
            await this.fillwithlog(this.element('vat'), info.vat)
        }
        if (info.phone){
            await this.fillwithlog(this.element('phone'), info.phone)
        }
        if (info.website){
            await this.fillwithlog(this.element('website'), info.website)
        }
    }

    async fillAddress(info: CustomerInfo){
        if (info.address){
            await this.fillwithlog(this.element('address'), info.address)
        }
        if (info.city){
            await this.fillwithlog(this.element('city'), info.city)
        }
        if (info.state){
            await this.fillwithlog(this.element('state'), info.state)
        }
    }

    async selectCurrency(info: CustomerInfo){
        if (info.currency){
            await this.helpers.selectBootstrapOption(this.element('currencyButton'), info.currency)
        }
    }

    async selectCountry(info: CustomerInfo){
        if (info.country){
            await this.helpers.selectBootstrapOption(this.element('countryButton'), info.country)
        }
    }

    async clickSaveButton(){
        await this.clickwithlog(this.element('saveButton'))
    }

    async expectOnPage(): Promise<void> {
        expect(this.element('asterik')).toBeVisible()
    }
}