import { mergeTests, expect } from '@playwright/test';

import { test as nekoUiTest } from '../api/neko-ui/fixtures/gatekeeper.fixture';

import { test as apiTest } from '../api/fixtures/gatekeeper.api.fixture';

export const test = mergeTests(nekoUiTest, apiTest);

export { expect } from '@playwright/test';

//combined