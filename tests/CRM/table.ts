//ví dụ đời thường: Tìm chỗ ngồi của bạn Tùng
// Có 1 dãy bàn có 3 chỗ ngồi
// Nếu nhớ máy móc thì sau khi có update thì sẽ bị sai

// Nên tạo một table map để có thể lưu thứ tự các cột
const headers = ['ID', 'FullName', 'Phone', 'Email']
type arrString = string[]
// mục tiêu tạo ra 1 cái map (Sơ đồ lớp học)
// {
//     "ID": 0,
//     "FullName": 3,
//     ...
// }

// function createSimpleMap(headerList: arrString) {
//     const map = {}
//     for (let index = 0; index < headerList.length; index++){
//         const tenCot = headerList[index];
//         map[tenCot] = index;
//         console.log(`Đã ghi nhớ cột ${tenCot} nằm ở vị trí ${index}`);
//     }
//     return map
// }
// const myMap = createSimpleMap(headers)
// // console.log(myMap['Email']);

// có những trường hợp thì người dùng sẽ gọi tới object theo 2 kiểu
//myMap['fullName']
//myMap['Full name']
// Ý tưởng là dựng được 1 hàm có thể support người dùng gọi bằng cả 2 cách mà vẫn trả về giá trị 

// Viết 1 hàm biến 1 word thành camelCase

//Full Name -> fullName
function toCamelCase(text: string): string {
    const words = text.toLowerCase().split(' ')

    let camelWord = words[0]
    for (let i = 1; i < words.length; i++) {
        const word = words[i].charAt(0).toUpperCase() + words[i].slice(1)
        camelWord += word
    }
    return camelWord
}
console.log(toCamelCase('hello world BRo'));

//có trường hợp mà header của chúng ta chưa có dấu cách: 
// ('   Hoc Js   ')> ('Hoc Js')
//['','','','Hoc','','','Js','','']
function cleanHeaderText(text: string): string {
    const letters = text.split(' ')
    //C1: const normalLetter = letters.filter(Boolean)
    //C2: 
    const normalLetter = letters.filter((word) => word !== '')
    return normalLetter.join(' ')
}
console.log(cleanHeaderText('   Hoc  Ts  '));

//bài toán ban đầu
const tableHeaders = ['    ID    ', '  Date Created ', 'customer name']
interface typeObject {
    columnIndex: number,
    headerText: string
}
//Hàm chính có login mapping
function createColumnMap(rawHeader: string[]) {
    const map: Record<string, typeObject> = {}
    for (let index = 0; index < rawHeader.length; index++) {
        let raw = rawHeader[index]

        const clean = cleanHeaderText(raw)
        const info = {
            columnIndex: index,
            headerText: clean
        }
        const camelKey = toCamelCase(clean)
        if (camelKey) map[camelKey] = info

        const lowerKey = clean.toLowerCase()
        if (lowerKey) map[lowerKey] = info
    }
    return map
}
const columnMap = createColumnMap(tableHeaders)
console.log(columnMap);


// Minh họa tạo map column và lưu cache
let domReadCount = 0

async function createColumnMapSimple(headersLocator) {
    domReadCount++
    console.log('[Dom] đang đọc Header để xây Map... (tốn 500ms)');
    return{
        name: {index: 0},
        age: {index: 1},
        email: {index: 2}
    }
}

async function getColumnInfo(headers, key, cache) {
    let map = cache
    if (!map){
        map = await createColumnMapSimple(headers)
    }
    return {info: map[key], columnMap: map}
}


async function getCellText() {
    return 'Data'
}

async function buildRowData(headers, row, keys, cache) {
    const rowData = {}
    let currentMap = cache
    for (const key of keys){
        const result = await getColumnInfo(headers, key, currentMap)
        // Cập nhật lại map cho vòng sau
        currentMap = result.columnMap
    }
    return {rowData, columnMap: currentMap}
}

const keyToGet = ['name', 'age', 'email']
const totoRows = 5

async function runScenario(name, cacheStrategy) {
    console.log(`Chay kich ban ${name}`);
    domReadCount = 0

    let globalCache = null

    for (let i=0; i< totoRows; i++){
        console.log(`Xu ly dong so ${i+1}`);
        const inputCache = cacheStrategy? globalCache: null
        const result = await buildRowData(null, null, keyToGet, inputCache)
        if (inputCache){
            globalCache= result.columnMap
        } 
    }

    console.log(`So dong da xu ly ${totoRows}`);
    console.log(`So lan doc lai headers: ${domReadCount}`);

    if (domReadCount>1){
        console.log('Hieu nang kem')
    }
    else {
        console.log('Hieu nang tot');
        
    }
}

(async ()=> {
    await runScenario('Khong dung cache', false)
    await runScenario('Co dung cache', true)
})()