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


// Kế thừa - kết hợp/thành phần (inheritance, composition)

//Kế thừa là mối quan hệ (là một ...)
// ví dụ con mèo là 1 động vật, giám đốc là 1 nhân viên
// con cái thừa hưởng gen của bm

// Kế hợp
// Cái xe hơi có một động cơ (chứ không phải xe hơi là động cơ)
// Tư duy: Lắp ráp logo: Tạo ra một vật thể lớn từ các mảnh ghép nhỏ

// Class cha
class SmartDevice {
    connectWifi(){
        console.log('connected wifi');
    }
    playMusicAndLight(){
        console.log('vua hat vua chieu sang');
        
    }
}

class WifiModule {
    connect() {
        console.log(`đã connnect`);
    }
}

class LightModule {
    on() {
        console.log(`đã bật`);
    }
}

class SpeakerModule {
    play(song: string){
        console.log(`dang hat ${song}`);
    }
}

class SingLight {
    private wifi = new WifiModule()
    private light = new LightModule()
    private speaker = new SpeakerModule()

    partyTime(){
        this.wifi.connect()
        this.light.on()
        this.speaker.play('OLLAA')
    }
}
const myPartyTime = new SingLight()
myPartyTime.partyTime()