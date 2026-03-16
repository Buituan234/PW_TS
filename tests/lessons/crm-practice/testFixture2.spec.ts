import {test} from './fixture/basic.fixture'

test('Test dùng toàn bộ fixture mới', async({randomNumber, greeting, userInfo}) => {
    console.log(`Lời chào ${greeting}`);
    console.log(`Số may mắn ${randomNumber}`);
    console.log(`Use: ${userInfo.name}`);    
})