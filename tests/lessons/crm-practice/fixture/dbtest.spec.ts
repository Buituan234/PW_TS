import {test } from './database.fixture'
import { expect } from '@playwright/test'

// File test là độc lập với nhau tránh sự phụ thuộc

//test1: Chạy đầu tiên
test('Test A: Kiểm tra số lượng user', async({addAdminUser}) => {
    // lúc này database đang có ['Adnin']
    console.log('Test A chạy ...');
    expect(addAdminUser.length).toBe(1)
})

test('TestB: Kiểm tra user mới', async ({ addAdminUser}) => {
    // Database lúc này đáng lẽ chỉ nên có 1 user (của testB đa tạo ra)
    // Nhưng nếu không có teardown của fixture thì sẽ có ['Admin','Admin'] (1 cái cũ của test A  + 1 cái mới của Test B)

    console.log('Test B đang chạy');
    console.log('Hiện tại đang có', addAdminUser);
    
    expect(addAdminUser.length).toBe(1)
})


//fixture chaining ... hiệu ứng domino