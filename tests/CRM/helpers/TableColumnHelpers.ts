import { Locator } from "@playwright/test"

export type columnInfo = {
    index: number,
    text: string
}

export type columnMap = Record<string, columnInfo>

export type TextMatcher = string | ((text: string) => boolean);

function toCamelCase(text: string): string {
    const words = text.toLowerCase().split(' ')

    let camelWord = words[0]
    for (let i = 1; i < words.length; i++) {
        const word = words[i].charAt(0).toUpperCase() + words[i].slice(1)
        camelWord += word
    }
    return camelWord
}

function cleanHeaderText(text: string): string {
    const letters = text.split(' ')
    //C1: b 
    //const normalLetter = letters.filter(Boolean)
    //C2: 
    const normalLetter = letters.filter((word) => word !== '')
    return normalLetter.join(' ')
}

export async function createColumnMap(headers: Locator): Promise<columnMap>{
    const count = await headers.count()
    const map: columnMap = {}
    
    for (let index = 0; index < count; index++){
        const headerLocator = headers.nth(index)
        const rawText = await headerLocator.innerText()

        const clean = cleanHeaderText(rawText)

        const info: columnInfo = {
            index,
            text: clean
        }

        const camelKey = toCamelCase(clean)
        if (camelKey){
            map[camelKey] = info
        }
        
        const lowerKey = clean.toLowerCase()
        if (lowerKey){
            map[camelKey] = info
        }
    }
    return map
}
export async function getColumnInfoSimple(
    headersLocator: Locator,
    columnKey: string,
    columnMapCache?: columnMap | null 
): Promise<{info: columnInfo; columnMap: columnMap}>{
    //B1: Thử dùng cache nếu có
    let map: columnMap | null = columnMapCache || null
    if (!map){
        map = await createColumnMap(headersLocator)
    }
    //B2: Tìm column trong map
    let info = map[columnKey]

    //B3: Nếu không thấy. Tạo lại map từ DOM
    // Retry strategy
    if (!info){
        map = await createColumnMap(headersLocator)
        info = map[columnKey]
    }

    if (!info){
        throw new Error(`Column ${columnKey} không tìm thấy`)
    }
    return {info, columnMap: map}
}

export type ColumnTextCleaner = (cell: Locator) => Promise<string>;

export async function getCellTextSimple(
  cell: Locator,
  columnKey: string,
  columnCleaner?: Record<string, ColumnTextCleaner>
): Promise<string> {
  ///B1: Kiểm tra xem custom cleaner cho column key có hay ko

  const cleaner = columnCleaner?.[columnKey];
  if (cleaner) {
    return cleaner(cell);
  }
  const text = await cell.textContent();
  return (text || '').trim();
}

export async function getColumnValuesSimple(
    headersLocator: Locator,
    rowsLocator: Locator,
    columnKey: string,
    columnCleaner?: Record<string, ColumnTextCleaner>,
    columnMapCache?: columnMap | null
): Promise<string[]>{
    const result = await getColumnInfoSimple(headersLocator, columnKey, columnMapCache)
    const count = await rowsLocator.count()

    const values: string[] = []
    for(let i = 0; i < count; i++){
        const cell= rowsLocator.nth(i).locator(`td:nth-child(${result.info.index + 1})`)
        values.push(await getCellTextSimple(cell, columnKey, columnCleaner))
    }
    return values
}

//hàm xây dựng object chứa dữ liệu của 1 row
//mục đích:
// lấy text từ nhiều cells trong 1 row
// trả về object với key = coloumnKey, value = text từ cell
// logic:
// 1. loop qua từng column key (từng cột)
//2. tìm ví trị cột (index) từ column map
//3. lấy cell ở vị trí đó trong row
//4. lấy text từ cell
//5. lưu vào rowData object

export async function buildRowDataSimple(
  headersLocator: Locator,
  rowsLocator: Locator,
  columnKeys: string[],
  columnCleaner?: Record<string, ColumnTextCleaner>,
  coloumnMapCache?: columnMap | null
): Promise<{ rowData: Record<string, string>; columnMap: columnMap }> {
  //khởi tạo object rỗng để lưu dữ liệu của row
  const rowData: Record<string, string> = {};
  let currentColumnMap = coloumnMapCache;
  for (const key of columnKeys) {
    //b1. lấy thông tin cột index...
    const result = await getColumnInfoSimple(headersLocator, key, coloumnMapCache);

    currentColumnMap = result.columnMap;
    //b2. tạo locator cho cell
    const cell = rowsLocator.locator(`td:nth-child(${result.info.index + 1})`);

    //b3. luu vao rowdata va column map moi nha
    rowData[key] = await getCellTextSimple(cell, key, columnCleaner);
  }
  return { rowData, columnMap: currentColumnMap! };
}

//lấy dữ liệu toàn bộ table
//logic:
// đếm só lượng rows
// loop qua từng row'
// với 1 row lấy dữ liệu từ các cột chỉ định
// push vào mảg kq

//
export async function getTableDataSimple(
  headersLocator: Locator,
  rowsLocator: Locator,
  columnKeys: string[],
  columnCleaner?: Record<string, ColumnTextCleaner>,
  coloumnMapCache?: columnMap | null
): Promise<Array<Record<string, string>>> {
  const rowCount = await rowsLocator.count();

  const data: Array<Record<string, string>> = [];

  let currentColumnMap = coloumnMapCache;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = rowsLocator.nth(rowIndex);

    const result = await buildRowDataSimple(
      headersLocator,
      row,
      columnKeys,
      columnCleaner,
      currentColumnMap
    );

    currentColumnMap = result.columnMap;

    data.push(result.rowData);
  }
  return data;
}

const textMatches = (cellValue: string, condition: TextMatcher): boolean => {
  //nếu truyền 1 vào chuỗi apple
  if (typeof condition === 'string') {
    return cellValue.includes(condition);
  }
  if (typeof condition === 'function') {
    return condition(cellValue);
  }
  return false;
};

// //logic
// 1. lấy vị trí cột
// 2. đếm số lượng rows
// 3. loop qua từng rows
// 4. lấy text từ cell ở cột đó
// 5. kiểm tra text có khớp với macher ko
// 6. nếu khớp trả về row
// 7. nếu ko khoipws throw error

export async function findRowByColumnValueSimple(
  headersLocator: Locator,
  rowsLocator: Locator,
  columnKey: string,
  matcher: TextMatcher,
  columnCleaner?: Record<string, ColumnTextCleaner>,
  coloumnMapCache?: columnMap | null
): Promise<Locator> {
  const result = await getColumnInfoSimple(headersLocator, columnKey, coloumnMapCache);
  const count = await rowsLocator.count();

  for (let i = 0; i < count; i++) {
    const row = rowsLocator.nth(i);
    const cell = row.locator(`td:nth-child(${result.info.index + 1})`);
    const text = await getCellTextSimple(cell, columnKey, columnCleaner);
    if (textMatches(text, matcher)) {
      return row;
    }
  }
  throw new Error(`Unable to find a row where ${columnKey} matches provided matcher`);
}

//B1
export async function findRowByFilterSimple(
  headersLocator: Locator,
  rowsLocator: Locator,
  filters: Record<string, TextMatcher>,
  columnCleaner?: Record<string, ColumnTextCleaner>,
  coloumnMapCache?: ColumnMap | null
): Promise<Locator> {
  const keys = Object.keys(filters);

  const count = await rowsLocator.count();

  let currentColumnMap = coloumnMapCache;

  //tối ưuL là lấy index trước, tránh phải tìm lại nhiều lần
  const columnInfos: ColumnInfo[] = [];

  for (const key of keys) {
    const result = await getColumnInfoSimple(headersLocator, key, currentColumnMap);
    currentColumnMap = result.columnMap;

    columnInfos.push(result.info);
  }

  ///loop qua tung row de tim row khop voi tat ca filter
  for (let i = 0; i < count; i++) {
    const row = rowsLocator.nth(i);

    let matchedAll = true;
    for (let j = 0; j < keys.length; j++) {
      // lấy key và column info tương ứng
      const key = keys[j]; // vi du 'company'
      const info = columnInfos[j]; // {index: 2, text: 'company'}

      const cell = row.locator(`td:nth-child(${info.index + 1})`);
      const text = await getCellTextSimple(cell, key, columnCleaner);

      if (!textMatches(text, filters[key])) {
        matchedAll = false;
        break;
      }
      // neu khop thi kiem tra filter tiep theo
    }
    if (matchedAll) {
      return row;
    }
  }
  throw new Error('Unable to find row matchign filter');
}