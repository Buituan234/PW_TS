// Điều quan trọng nhất là import từ file fixture của mình chứ không phải thư viện gốc

import {test} from './fixture/robot.fixture'

test('Khách hàng kiểm tra lời chào robot', async ({loiChao}) => {
    console.log('Bắt đầu test');

    console.log(loiChao);
    
})