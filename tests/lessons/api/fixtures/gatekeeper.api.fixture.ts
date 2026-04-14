import { AuthApiFixture, test as authTest } from "./auth.api.fixture";
import { serviceFixtures, ServicesFixtures } from "./services.fixture";
import { expect } from  '@playwright/test'

export type GateKeeperApiFixture = AuthApiFixture & ServicesFixtures

export const test = authTest.extend<GateKeeperApiFixture>({
    ...serviceFixtures
})

export { expect } from '@playwright/test'
