import {test} from '@playwright/test'
// test.afterEach(async ({}, testInfo) => {
//     console.log(`[Kết  thúc chạy file test] trạng thái: ${testInfo.status}`);
//     console.log((`[Kết thúc chạy file test] thời gian chạy: ${testInfo.duration}`));
// })

// test('Demo test Info', async ({page}, testInfo) => {
//     console.log('Thông tin cơ bản về file test');
//     console.log(`Tên bài test: ${testInfo.title}`);
//     console.log(`File bài test: ${testInfo.file}`);
//     console.log(`Project ${testInfo.project.name}`);
//     console.log(`Timeout ${testInfo.timeout}`);
//     console.log(`Đây là lần chạy thứ ${testInfo.retry+1} (Retry index: ${testInfo.retry})`);
//     console.log(`Worker infdex: ${testInfo.workerIndex}`);
    
//     if (testInfo.project.name.includes('Mobile')){
//         console.log(`Mobile chưa hỗ trợ test này > Skip`);
//         testInfo.skip()
//     }
//     await page.goto('admin/authentication')

//     testInfo.annotations.push({
//         type: 'Jira Ticket',
//         description: 'http://jira.com.vn'
//     })

//     // chụp ảnh thủ công và đính kèm vào report
//     const screenshot = await page.screenshot()
//     await testInfo.attach('Ảnh đăng nhập thành công', {
//         body: screenshot,
//         contentType: 'image/png'
//     })
// })

// test('Đăng nhập thành công @smoke', async ()=> {
//     // Cách thêm tag cổ điển: Thêm vào tên của file test
//     console.log('Test đăng nhập @smoke');
// })

// test('Thêm vào giỏ hàng', {tag: '@regression'}, async()=> {
//     // Cách thên hiện đại: Thêm vào object ở vị trí tham số thứ 2 của file test
//     console.log('Test gio hang (@regression)');
// })
// test('Thanh toán thẻ Visa debit', {tag: ['@smoke', '@slow']}, async()=> {
//     // tag có thể là 1 mảng
//     console.log(`Test thanh toán thẻ (@smoke + @slow)`);
// })
// test.describe('Nhóm quản lý các user', {tag: '@authen'}, async()=> {
//     // Có thể thêm tag cho cả 1 scenario
//     test('Đổi mật khẩu', async()=> {
//         console.log('test đổi mật khẩu (@authen)');
//     })
// })
