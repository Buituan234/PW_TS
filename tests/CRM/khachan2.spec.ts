import {test} from './fixture/index2'

test('Khach gọi combo sáng(Phở + Cafe đen)', async ({ phoBo, cafeDen}) => {
    // GỌi món từ bếp
    console.log(`Khách ăn ${phoBo}`);

    // Gọi món từ Bar
    console.log(`Khach uống ${cafeDen}`);
})