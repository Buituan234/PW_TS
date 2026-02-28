import { Locator } from "@playwright/test"
import { error } from "node:console"

export type columnInfo = {
    index: number,
    text: string
}

export type columnMap = Record<string, columnInfo>

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