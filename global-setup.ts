import { FullConfig } from '@playwright/test';


async function globalSetup(config: FullConfig) {

  console.log('🌅 [GLOBAL SETUP] Bắt đầu khởi động hệ thống...');


  // Giả sử ta khởi động một Server DB ảo mất 1 giây

  await new Promise(r => setTimeout(r, 1000));


  // QUAN TRỌNG: Truyền dữ liệu cho các bài Test bằng biến môi trường (Environment Variables)

  process.env.DB_CONNECTION_URL = 'postgres://admin:123456@localhost:5432/my_db';

  process.env.API_PORT = '8080';

  console.log('✅ [GLOBAL SETUP] Đã bật Server tại port 8080. Sẵn sàng!');

}

export default globalSetup;