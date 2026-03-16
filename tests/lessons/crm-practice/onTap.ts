//clone
function cloneData<T>(data: T): T{
    //c1: structured clone (công nghệ mới, copy siêu sâu)
    if (typeof structuredClone !== 'undefined'){
        return structuredClone(data)
    }
    return JSON.parse(JSON.stringify(data))
}

const CAR_CATALOG = {
    sedans: {
        camry_standard: {
            description: 'Camry phiên bản tiêu chuẩn',
            data: {
                //1.
                model: 'Camry 2.0G',
                color: 'Black',
                isSold: false,
                engige: {
                    type: '2.0L Pertrol',
                    power: '200HP',
                    fuel: 'Gas'
                },
                interior: {
                    seats: 'Leather',
                    color: 'Black'
                },
                accessories: ['Tham san', 'Phim cach nhiet'],
            }
        }
    }
}

//namespace: Khuvuc

//Key: mau xe
function produceCar (namespace, key, options?){
    console.log(`Lenh san xuat: ${namespace} -> ${key}`);

    //1. Lấy khung xe từ kho
    const template = CAR_CATALOG[namespace][key]
    if(!template) throw new Error('Không tìm thấy mẫu xe')

    //2. Clone (tao xe mới)
    let mycar = cloneData(template.data);

    if (options && options.overrides){
        Object.assign(mycar, options.overrides);
    }

    if (options && options.transform) {
        mycar = options.transform(mycar)
        console.log('Transform đã độ xe');
    }
    return mycar
}

const case1 = produceCar('sedans','camry_standard')
console.log(case1);

//Muốn đổi màu sơn xe đã bán
const case2 = produceCar('sedans','camry_standard', {
    overrides: {
        color: 'Pink',
        isSold: true
    }
})
console.log(case2);

const case3 = produceCar('sedans', 'camry_standard', {
    transform: (car) => {
        car.engige.power = '500HP';
        return car
    }
});
console.log('case3');

const case4 = produceCar('sedans', 'camry_standard', {
    transform: (car) => {
        car.accessories.push('camera hanh trinh')
        return car
    }
});
console.log(CAR_CATALOG.sedans.camry_standard.data);


