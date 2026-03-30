import { AuthApiFixture, test as authTest } from "./auth.api.fixture";
import { serviceFixture, ServicesFixture } from "./services.fixture";
import { expect } from  '@playwright/test'

export type GateKeeperApiFixture = AuthApiFixture & ServicesFixture

export const test = authTest.extend<GateKeeperApiFixture>({
    ...serviceFixture
})

export { expect }
