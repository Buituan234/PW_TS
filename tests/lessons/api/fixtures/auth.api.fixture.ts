import { test as base} from '@playwright/test'
import fs from 'fs'
import path from 'path'

const tokenFile = path.resolve('auth/neko-token.json')

export type AuthApiFixture = {
    authToken: string
}

export const test = base.extend<AuthApiFixture>({
    authToken: async ({}, use) => {
        if(!fs.existsSync(tokenFile)){
            throw new Error('Token not found')
        }
        const data = JSON.parse(fs.readFileSync(tokenFile,'utf-8'))
        await use(data.token)
    }
})