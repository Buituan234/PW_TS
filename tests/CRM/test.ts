const direction = {
    UP: 'up',
    DOWN: 'down'
}
// khai báo như này thì giá trị của các biến Up, Down vẫn có thể thay đổi được
direction.UP = 'left' // vẫn bị gán lại
// vậy nên phải viết như này
// const direction = {
//     UP1: 'up',
//     DOWN1: 'down'
// } as const
// nếu viết như này thì giá trị của các biến trong object không thể thay đổi
// Tương tự với mảng
const env = ['prd', 'uat', 'dev'] as const
//env.push() 
// // không thể thêm các giá trị mới vào mảng

const setting = {
    notification: true,
    theme: 'dark',
    version: 1.0
}
// Nếu kiểu dữ liệu và type của object setting kia muốn được sử dụng lại thì có thể:
// Khai báo 1 kiểu interface từ đầu
interface Settings {
    notification: boolean,
    theme: string,
    version: number
}
// hoặc có thể khai báo 1 type trực tiếp
type settingType = typeof setting
// có thể lấy được type ra để dùng lại


// keyof
interface User {
    id: number,
    name: string,
    email: string
}
type userKey = keyof User
// khi đó type userKey = 'id'|'name'|'email'

const colors = {
    red: '#FF0000',
    blue: '#00FF00',
    green: '#0000FF'
} as const
//2 cách lấy giá trị của object
// colors.green
//colors['green']

// tạo một hàm thay đổi màu mà chỉ cần nhập tên màu trong object
// ở đây ta dùng cách viết thứ 2: nên cần 1 nhập vào một key của object
type colorKey = keyof typeof colors
function chooseColor(color: colorKey) {
    console.log(colors[color])
}
chooseColor('blue')

// ví dụ 2:
// Thông tin về configure môi trường
const config = {
    endPoint: 'http://api.com',
    timeOut: 3000,
    retries: 3
} as const
function configInfo(key: keyof typeof config) {
    return config[key]
}
const endPoint = configInfo('endPoint')


//Partial
interface userInfo {
    id: number,
    name: string,
    phone: number,
    email: string
}
//>> Partial sẽ giúp chuyển type phía trên thành
// interface userInfo {
//     id?: number,
//     name?: string,
//     phone?: number,
//     email?: string
// }
// Cú pháp partial 
// Ví dụ tôi muốn viết một hàm để update user information: Cú pháp Partial<type>
function updateUserInformation(orig: userInfo, upd: Partial<userInfo>): userInfo {
    return {
        ...orig,
        ...upd
    }
}
const userA = {
    id: 1,
    name: 'A',
    phone: 2090,
    email: '123@gmail.com'
}
const userB = updateUserInformation(userA, { id: 2, name: 'B', email: 'tuan@gmail.com' })
console.log(userB);

// rest param và destructoring
interface userEntity {
    id: number,
    name: string,
    password: number,
    secretKey: string,
    role: string
}
const dbUser: userEntity = {
    id: 102,
    name: 'Tuấn',
    password: 9001,
    secretKey: 'tuan12op',
    role: 'admin'
}
// sử dụng rest param (phần còn lại) và destructoring để tách id và secretKey ra khỏi phần còn lại
function chuanHoaUser(user: userEntity) {
    const { id, secretKey, ...restPart } = user
    return restPart
}
const userChuanHoa = chuanHoaUser(dbUser)
// Phân rã object thì cần điền đúng tên key còn khi phân rã mảng thì chỉ cần lấy đúng thứ tự trong 
// mảng còn tên thì không cần chính xác

// Records: tạo nên 1 object mà không biết chính xác các thành phần của key và value của object đó
type productPrice = Record<string, number>
// tạo ra một loại type có key và value là dạng number
const product: productPrice = {
    tivi: 120,
    'tủ lạnh': 320,
    'Điều hòa': 1200
}
// có thể dùng dấu nháy đơn hoặc để nguyên key nếu không có dấu cách
type orderStatus = 'pending' | 'shipping' | 'delivered'
type statusLabels = Record<orderStatus, string>
const status_1: statusLabels = {
    pending: 'đang chờ món',
    shipping: 'đang giao đồ ăn',
    delivered: 'đã giao hàng'
}

// closure -> hàm trả về một hàm
// bình thường: khi 1 hàm chạy xong, nó chết đi và quên sạch kí ức (biến cục bộ bị xóa sạch khỏi bộ nhớ)
// closure:  khi hàm cha return về 1 hàm con,  hàm con đó giống như được đeo 1 ba lô: "ba lô kí ức"
// trong balo chứa tất cả các biến của hàm dù hàm cha đã chạy xong, hàm con vẫn mang theo cái balo này
function hamCha(x: number) {
    // trong ngoặc là biến cục bộ
    return function (y: number) {
        return x + y
    }
}
// điều kiện là phải hứng giá trị của hàm closure bằng 1 biến
const add5And = hamCha(5)
const add2 = add5And(2)
console.log(add2);
// Ứng dụng: tạo ra nhà máy tạo hàm
function hamNhan(x: number) {
    return function soBiNhan(y: number) {
        return x * y
    }
}
const nhan2 = hamNhan(2)
console.log(nhan2(3)); // nhân 2 với 3 >> 6
const hamNhan3 = hamNhan(3)
console.log(hamNhan3(3)); // nhân 3 với 3 >> 9

// TƯ DUY TẠO RA MỘT HỆ THỐNG ĐỒNG BỘ HÓA DỮ LIỆU
//1. Mình có 1 object gốc
// const source = { KeyA: '...'}
//2. Lấy hết key của object ra để tạo ra 1 dạng type mới
// type sourceType = keyof typeof source
// 3. Dùng record để bắt buộc 1 objct khác có  dạng y hệt object gốc
//type newobject = Record<sourceType, valueType>

const ENV = {
    DEV: 'Development',
    STAGE: 'Staging',
    PROD: 'Product'
}
type envList = keyof typeof ENV

interface envConfig {
    baseURL: string,
    retries: number,
    timeOut: number
}
type envInfo = Record<envList, envConfig>
const envInformation: envInfo = {
    DEV: {
        baseURL: 'dev',
        retries: 3,
        timeOut: 30
    },
    STAGE: {
        baseURL: 'staging',
        retries: 4,
        timeOut: 40
    },
    PROD: {
        baseURL: 'product',
        retries: 5,
        timeOut: 50
    }
}
const devinfor = envInformation['DEV']

// Ví dụ về closure
const cacDipLe = {
    Chrismus: 'Giáng sinh',
    Tet: 'Tết',
    Valentine: 'Lễ tình nhân'
}
type HolidayType = keyof typeof cacDipLe
//type feeInHolidays = record<HolidayType, >
const memType = {
    Standard: 'Người dùng tiêu chuẩn',
    GOld: 'NGười dùng cấp độ vàng',
    VIP: 'Người dùng vip'
}
type memberType = keyof typeof memType
type memberFeeValue = Record<memberType, number>

// Khai báo biến có key là các ngày lễ và value là các mức phí của từng loại member
type feeInHolidays = Record<HolidayType, memberFeeValue>
const feeInHolidayConfig: feeInHolidays = {
    Chrismus: {
        Standard: 0.98,
        GOld: 0.6,
        VIP: 0.45
    },
    Tet: {
        Standard: 0.9,
        GOld: 0.5,
        VIP: 0.4
    },
    Valentine: {
        Standard: 0.95,
        GOld: 0.7,
        VIP: 0.55
    },
}

// Hàm tính giá tiền thanh toán với từng mức phí
function feeCaculator(Holiday: HolidayType) {
    console.log('Đang tính tổng số tiền phải trả:');
    return (memType: memberType, amount: number): number => {
        const holidayChoose = feeInHolidayConfig[Holiday]
        const memberDiscount = holidayChoose[memType]
        console.log('Số tiền khác hàng phải trả là:');
        return memberDiscount * amount
    }
}
// Trong dịp giáng sinh, người vip đi mua hàng với tổng tiền 500
const tinhTienLeGiangSinh = feeCaculator('Chrismus')
const finalMoney = tinhTienLeGiangSinh('Standard', 500)
console.log(finalMoney);


// bài toán máy bán nước, nhập vào menu và chọn các món trong menu đó
const menu = {
    cocacolo: 'coca-cola lạnh nè',
    sinhToBo: () => 'Nước + Đá + Đường + Bơ => Sinh tố đã xong',
    chocolate: 'thanh socola đắng'
}
// Tạo hàm để truyền menu vào và cho chọn các option

type doUong = string
type tenDoUong = string

function xemMenu<T extends Record<tenDoUong, doUong | (() => doUong)>>(menu: T): (nuoc: keyof T)=> doUong {
    console.log('Mời quý khách chọn món:');
    return (nuoc: keyof T) => {
        const congThuc = menu[nuoc]
        if (typeof congThuc === 'function') {
            console.log('Xin quy khách chờ một lát để pha chế');
            return congThuc()
        }
        else {
            console.log('Đồ uống của bạn đã có sẵn đây:');
            return congThuc
        }
    }
}
// gọi menu ra xem món nào
const xemMenuNao = xemMenu(menu)
const chooseSinhTo = xemMenuNao('sinhToBo')
console.log(chooseSinhTo);



