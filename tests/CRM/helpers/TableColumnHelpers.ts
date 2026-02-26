import { Locator } from "@playwright/test"

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
    //C1: const normalLetter = letters.filter(Boolean)
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