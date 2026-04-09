import { mergeTests, expect } from '@playwright/test';

import { test as nekoUiTest } from '../neko/fixture/gatekeeper.fixture';
import { test as apiTest } from '../api/fixtures/gatekeeper.api.fixture';

export const test = mergeTests(nekoUiTest, apiTest);

export { expect };

//combined