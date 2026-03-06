import customers from './customers.json' 
import customersDev from './customers-dev.json' 
import { assert } from 'console';

function loadDataByEnv<T>(base: T, dev: T): T {
  // Lấy environment từ process.env (có sẵn trong Node.js/Playwright)
  // @ts-ignore - process.env có sẵn trong Node.js runtime
  const env = (process.env.NODE_ENV || process.env.TEST_ENV || 'dev').toLowerCase();

  switch (env) {
    case 'dev':
    case 'development':
      return dev;
    default:
      // Fallback: Dùng file schema (base) làm default
      return base;
  }
}

type DataEntry = {
  description?: string; // Mô tả (optional)
  data: any; // Dữ liệu (có thể là object, array, hoặc primitive)
};

export const testDataCatalog = {
  customers: loadDataByEnv(customers, customersDev), //  Tự động load theo môi trường
  //  loginCases, // Login cases không cần load theo env
  // orders: loadDataByEnv(orders, ordersDev, ordersUat, ordersProd),
  // products: loadDataByEnv(products, productsDev, productsUat, productsProd),
} as const;

export type TestDataNamespace = keyof typeof testDataCatalog;

function cloneData<T>(data: T): T {
  // Cách 1: structuredClone (modern, nhanh, support nhiều types)
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(data);
  }

  // Cách 2: JSON (fallback, chậm hơn, chỉ support JSON-serializable)
  return JSON.parse(JSON.stringify(data));
}

// ============================================================
// MAIN FUNCTION - getTestDataSimple()
// ============================================================

export function getTestDataSimple<
  N extends TestDataNamespace,
  K extends keyof (typeof testDataCatalog)[N],
>(
  namespace: N,
  key: K,
  options?: {
    overrides?: Record<string, any>; // Override fields (chỉ cho object)
    transform?: (data: any) => any; // Transform data (cho mọi type)
  }
): any {
  // ───────────────────────────────────────────────────────
  // BƯỚC 1: Kiểm tra namespace có tồn tại không
  // ───────────────────────────────────────────────────────
  // TypeScript đã check type ở compile-time (với keyof)
  // Nhưng vẫn cần check runtime để đảm bảo an toàn.
  // Cast về any để tách concerns: type-safe cho namespace/key, runtime chỉ cần object indexable.
  const namespaceData = testDataCatalog[namespace] as any;
  if (!namespaceData) {
    throw new Error(
      `Namespace "${String(namespace)}" không tồn tại trong catalog. ` +
        `Các namespace có sẵn: ${Object.keys(testDataCatalog).join(', ')}`
    );
  }

  // ───────────────────────────────────────────────────────
  // BƯỚC 2: Kiểm tra key có tồn tại trong namespace không
  // ───────────────────────────────────────────────────────
  // TypeScript đã check type ở compile-time (với keyof TestDataCatalog[N])
  // Nhưng vẫn cần check runtime để đảm bảo an toàn
  const entry = namespaceData[key];
  if (!entry) {
    throw new Error(
      `Key "${String(key)}" không tồn tại trong namespace "${String(namespace)}". ` +
        `Các keys có sẵn: ${Object.keys(namespaceData).join(', ')}`
    );
  }

  // ───────────────────────────────────────────────────────
  // BƯỚC 3: Clone data (tránh thay đổi data gốc)
  // ───────────────────────────────────────────────────────
  // Clone để đảm bảo mỗi lần gọi getTestDataSimple() → data mới
  // Không ảnh hưởng đến data gốc trong catalog
  // Cast về DataEntry để TypeScript biết có property 'data'
  // (as unknown as DataEntry): Cast qua unknown trước để tránh type error
  const dataEntry = entry as unknown as DataEntry;
  let result = cloneData(dataEntry.data);

  // ───────────────────────────────────────────────────────
  // BƯỚC 4: Apply overrides (nếu có)
  // ───────────────────────────────────────────────────────
  // Overrides chỉ support cho object (không phải array/primitive)
  // Vì Object.assign() chỉ hoạt động với object
  if (options?.overrides) {
    // Kiểm tra: result phải là object (không phải array, không phải null)
    if (Array.isArray(result)) {
      throw new Error(
        `Không thể dùng overrides cho array. ` +
          `Hãy dùng transform() thay thế: ${String(namespace)}.${String(key)}`
      );
    }

    if (typeof result !== 'object' || result === null) {
      throw new Error(
        `Không thể dùng overrides cho primitive (string, number, boolean). ` +
          `Hãy dùng transform() thay thế: ${String(namespace)}.${String(key)}`
      );
    }

    // Merge overrides vào result
    // Object.assign: Copy tất cả properties từ overrides vào result
    // → Override các fields có trong overrides
    Object.assign(result, options.overrides);
  }

  // ───────────────────────────────────────────────────────
  // BƯỚC 5: Apply transform (nếu có)
  // ───────────────────────────────────────────────────────
  // Transform cho phép custom logic (cho mọi type: object, array, primitive)
  // Ví dụ: Filter array, map array, modify object, add fields, etc.
  if (options?.transform) {
    result = options.transform(result);
  }

  // ───────────────────────────────────────────────────────
  // BƯỚC 6: Return data
  // ───────────────────────────────────────────────────────
  return result;
}