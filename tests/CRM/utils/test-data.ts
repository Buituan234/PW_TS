import { faker } from "@faker-js/faker";
import { format } from "date-fns";
import { CustomerInfo } from "../pom/CRMNewCustomerPage";

export function generateCompanyName(prefix: string): string{
    const fakeCompany = faker.company.name()
    const timeStamp = format(new Date(), 'HH:mm:ss')
    return `${prefix} ${fakeCompany} ${timeStamp}`
}

export function createMinimalCustomerInfo(override?: Partial<CustomerInfo>): CustomerInfo{
    return {
        company: generateCompanyName('Auto PW'),
        ...override
    }
}

export function createFullCustomerInfo(override?: Partial<CustomerInfo>): CustomerInfo{
    return {
        company: generateCompanyName('Auto Pw'),
        vat: faker.string.uuid(),
        phone: faker.phone.number(),
        website: faker.internet.url(),
        currency: "USD",
        language: "Vietnamese",
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: "Vietnam",
        ...override
    }
}