import {test ,expect} from './fixture/index'

test('Khach gọi combo sáng(Phở + Cafe đen)', async ({ phoBo, cafeDen}) => {
    // GỌi món từ bếp
    console.log(`Khách ăn ${phoBo}`);

    // Gọi món từ Bar
    console.log(`Khach uống ${cafeDen}`);
})