import { test } from './fixture/deskSetup.fixture';

test('Đọc sách', async ({ denBan }) => {
  // setup(nguonDien)
  // setup(oCam)
  console.log(`Khách: ${denBan} đang đọc sách`);
});

///cái gì bật sau cùng phải tắt đầu tiên
///thứ tự
// setup ->1 ->2 ->3
//tearDown > 3 -> 2 ->1
// đèn -> ổ cắm -> cầu dao.
// thằng nào setup đầu tiên thì teardown cuối cùng.

3;
2;
1;