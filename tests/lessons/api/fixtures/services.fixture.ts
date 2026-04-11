import { APIRequestContext, request as playwrightRequest } from '@playwright/test';
import { ProductService } from '../services/ProductService';
import { AuthApiFixture } from './auth.api.fixture';

const API_BASE_URL = 'https://api-neko-coffee.autoneko.com';

export type ServicesFixtures = {
  apiRequest: APIRequestContext;
  productService: ProductService;
};

type ServiceDeps = { apiRequest: APIRequestContext } & AuthApiFixture;

export const serviceFixtures = {
  apiRequest: async ({}, use: (r: APIRequestContext) => Promise<void>) => {
    const ctx = await playwrightRequest.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-type': 'application/json',
      },
    });
    await use(ctx);
    await ctx.dispose();
  },

  productService: async (
    { apiRequest, authToken }: ServiceDeps,
    use: (r: ProductService) => Promise<void>
  ) => {
    await use(new ProductService(apiRequest, authToken));
  },
};