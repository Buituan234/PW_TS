import { test as setup, expect} from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { AuthService } from './services/AuthServices'

const authFile = path.resolve('auth/neko-token.json')

function isTokenValidByExpiresAt(expiresAt: string): boolean {
    if (!expiresAt) return false
    const expiry = new Date(expiresAt).getTime()

    const now = Date.now()
    const bufferTime = 5 * 60 * 1000
    return expiry > now + bufferTime
}

setup('Authentication Neko API', async({ request}) => {
    if (fs.existsSync(authFile)) {
        const data = JSON.parse(fs.readFileSync(authFile, 'utf-8'))

        const isValid = data.expires_at ? isTokenValidByExpiresAt(data.expires_at): false

        if (data.token && isValid){
            console.log('Token còn hạn, skip login');
            return
        }
        console.log('Token hết hạn, login lại');

        //login check token đã tồn tại . ok > thì  bỏ qua luôn không cần login lại
    }
    const authService = new AuthService(request)
    const response = await authService.login('tuan1', '123456789')
    expect(response.accessToken).toBeTruthy()

    const authDir = path.dirname(authFile)

    if(!fs.existsSync(authDir)){
        fs.mkdirSync(authDir, {recursive: true})
    }
    fs.writeFileSync(
        authFile,
        JSON.stringify({
            token: response.accessToken,
            expires_at: response.expiresAt,
        })
    )
})