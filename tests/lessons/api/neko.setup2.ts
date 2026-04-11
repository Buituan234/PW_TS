import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { AuthService } from './services/AuthServices';
import {
  getStorageStatePath,
  loadTokenFile,
  isTokenValidByJWT,
  isStorageStateValid,
  loginAndSaveStorageState,
  saveTokenFile,
} from '../../utils/auth.utils';

setup('Authentication Neko APi', async ({ request }) => {
  //file danh cho api
  const tokenData = loadTokenFile();
  //file danh cho UI
  const adminStoragePath = getStorageStatePath('admin');

  if (
    tokenData?.token &&
    isTokenValidByJWT(tokenData.token) &&
    isStorageStateValid(adminStoragePath)
  ) {
    console.log(`Token còn hạn, skip login`);
    return;
  }
  console.log('Login in admin');
  const result = await loginAndSaveStorageState(request, 'admin');
  expect(result.accessToken).toBeTruthy();

  saveTokenFile(result.accessToken, result.refreshToken, result.expiresAt);
});

//logic
// lần đầu tiên đăng nhập chưa có file token
// -> lưu thành công ok -> chạy test lần 1 ok

// lần 2/ lại login 0-> lấy token ???? hơi phí thời gian  dựa vào cái expire In để check nếu mà token còn hạn
// thì chúng ta xài lại ko cần login nữa.

// ví như là thời hạn token là 30 phút

// chúng ta chạy test ví dụ mất khoảng 5 phút

// 25 - 30 phút (token expire) -> là chúng ta call mới

// nếu mà chúng ta check token ở thời gian 26 phút -> test sẽ fail  -> do token expires