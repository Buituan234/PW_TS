import { mergeTests } from "@playwright/test";
import { testBar } from "./bar2.fixture";
import { testKitchen } from "./kitchen2.fixture";

//Tạo ra một siêu Robot có sức mạnh của kitchen + bar
export const test = mergeTests(testBar, testKitchen)

import { expect } from '@playwright/test'