function makeCake(flavor: 'chocolate' | 'vanilla', layers: number, isVegan: boolean){
    console.log(`Making a ${layers} - layers ${flavor} cake. Vega: ${isVegan}`);
}

type makeCakeType = typeof makeCake

type CakeInputs = Parameters<makeCakeType>

type flavor = CakeInputs[0]

type pageName = 'Home' | 'Login' | 'Dashboard'

// -> Muốn tạo ra một cái object có key là page name và value là 1 string
// trong cái object day co bn gia tri khong cần biết
// chỉ cần biết là tôi có key là pahgename, và value là string
// > Sử dụng record

const appPage: Record<pageName, string> = {
    Home: '/home',
    Login: '/login',
    Dashboard: '/dashboard'
}

interface coTheCanCuoc {
    id: string
}

function checkIn<T extends coTheCanCuoc>(nguoiDung: T) {
    console.log(`Khach hang có ID ${nguoiDung.id} duoc phep vao`);
    return nguoiDung  
}

const nguoiA = {id: '123'}
checkIn(nguoiA)

const richkid = {
    id: '9999',
    name: 'batman',
    money: 10000
}
//checkIn(richkid): Chỉ cần chứa key là id có value là string là có thể truyền vào

const nguoiQuenVi = {
    name: 'Joker'
}
//checkIn(nguoiQuenVi): Không thể truyền vào các biến object mà không có key là id và value là string

interface Customer {
    userName: string,
    password: string,
    plan: 'free' | 'vip',
    isActive: boolean
}
function createStore<T extends Record<string, Customer>>(fixture: T) {
    return (key: keyof T) => {
        return fixture[key]
    };
}
const getTestUser = createStore({
    standardUser: {
        userName: 'User123',
        password: '123',
        plan: 'free',
        isActive: true
    },
    vipUser: {
        userName: 'User123',
        password: '123',
        plan: 'vip',
        isActive: true
    }
})
const data = getTestUser('standardUser')

// Ví dụ 2: 
function createLogger<T extends Record<string, string>> (evenMap: T) {
    return (eventName: keyof T){
        const code = evenMap[eventName]
        console.log(`Gui su kien ${String(eventName)}) - mã: ${code} `);
    }
}
const eventMap = {
    BTN_CLICK_SIGUP: 'EVT_01',
    BTN_CLICK_HOME: 'EVT_02'
}
const logList = createLogger(eventMap)
logList('BTN_CLICK_HOME')