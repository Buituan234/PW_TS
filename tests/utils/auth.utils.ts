import path from 'path'
import fs, { accessSync } from 'fs'
import { APIRequestContext } from '@playwright/test'
import { error } from 'console'
import { decode } from 'punycode'

export const AUTH_CONFIG = {
    AUTH_DIR: path.resolve('auth'),
    API_URL: 'http://api-neko-coffe.autoneko.com',
    UI_ORIGIN: 'http://coffee.autoneko.com',
    BUFFER_MINUTES: 5,
}

export type RoleName = 'admin' | 'staff'

export const ROLE_CREDENTIAL: Record<string, { username: string; password: string }> = {
    admin: { username: 'admin', password: 'Admin@123' },
    staff: { username: 'tuan1', password: '123456789' }
}

// yJlbWFpbCI6ImFkbWluQG5la29jb2ZmZWUudm4iLCJleHAiOjE3Njk1MjIyOTEsImlhdCI6MTc2OTUyMDQ5MSwicm9sZSI6ImFkbWluIiwic3ViIjoxLCJ1c2VybmFtZSI6ImFkbWluIn0
// -> JSON STRING -> object

export function decodeJWT(token: string): Record<string, unknown> | null {
    try {
        const payload = token.split('.')[1]
        return JSON.parse(Buffer.from(payload, 'base64').toString())
    }
    catch {
        return null
    }
}

export function isTokenValidByJWT(token: string): boolean {
    const payload = decodeJWT(token)
    const expiry = payload?.exp ? (payload.exp as number) * 1000 : null
    if (!expiry) return false

    const bufferMs = AUTH_CONFIG.BUFFER_MINUTES * 60 * 1000
    return expiry > Date.now() + bufferMs
}

export function getStorageStatePath(role: RoleName): string {
    return path.join(AUTH_CONFIG.AUTH_DIR, `${role}.json`)
}

export function isStorageStateValid(filePath: string): boolean {
    if (!fs.existsSync(filePath)) return false

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

        const localStorage = data.origin?.[0]?.localStorage as Array<{ name: string, value: string }>
        if (!localStorage) return false

        const nekoAuthItem = localStorage.find((item) => item.name === 'neko_auth')
        if (!nekoAuthItem) return false

        const nekoAuthString = nekoAuthItem.value

        const nekoAuth = JSON.parse(nekoAuthString)
        const expireAt = nekoAuth.state.expireAt

        if (!expireAt) return false

        const bufferMs = AUTH_CONFIG.BUFFER_MINUTES * 60 * 1000
        return expireAt > Date.now() + bufferMs
    }
    catch {
        return false
    }
}

export function createStorageStateNekoAuth(
    accessToken: string,
    refreshToken?: string,
    expireAt?: string
) {
    const jwtPayload = decodeJWT(accessToken)
    const user = jwtPayload ? {
        id: jwtPayload.sub as number,
        username: jwtPayload.username as string,
        email: jwtPayload.email as string,
        role: jwtPayload.role as string
    }
        : null

    const expireAtMs = expireAt ? new Date(expireAt).getTime() : (jwtPayload?.exp as number) * 1000
    const nekoAuthState = JSON.stringify({
        state: {
            user,
            accessToken,
            refreshToken: refreshToken || '',
            expireAt: expireAtMs,
            isAuthenticated: true
        },
        version: 0,
    })

    return {
        cookie: [],
        origin: [
            {
                origin: AUTH_CONFIG.UI_ORIGIN,
                localStorage: [
                    { name: 'access_token', value: accessToken },
                    { name: 'neko_auth', value: nekoAuthState },
                    { name: 'refresh_token', value: refreshToken || '' }
                ]
            }
        ]
    }
}

export interface LoginResult {
    accessToken: string,
    refreshToken?: string,
    expiresAt?: string,
    user: {
        id: number,
        username: string,
        email: string,
        role: string,
    } | null
}

export async function loginAndSaveStorageState(
    request: APIRequestContext,
    role: RoleName,
    option?: {}
): Promise<LoginResult> {
    const creds = ROLE_CREDENTIAL[role]
    if (!creds) {
        throw new Error('Unknow role ${role}')
    }
    const response = await request.post(`${AUTH_CONFIG.API_URL}/auth/login`, {
        data: {
            username: creds.username,
            password: creds.password
        }
    })

    if (!response.ok()) {
        throw new Error(`Login failed for ${role}: ${response.status()}`);
    }

    const data = await response.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const expiresAt = data.expires_at;

    const jwtPayload = decodeJWT(accessToken);

    const user = jwtPayload
        ? {
            id: jwtPayload.sub as number,
            username: jwtPayload.username as string,
            email: jwtPayload.email as string,
            role: jwtPayload.roke as string,
        }
        : null;
    const storageState = createStorageStateNekoAuth(accessToken, refreshToken, expiresAt);

    if (!fs.existsSync(AUTH_CONFIG.AUTH_DIR)) {
        fs.mkdirSync(AUTH_CONFIG.AUTH_DIR, { recursive: true });
    }

    const filePath = getStorageStatePath(role);
    fs.writeFileSync(filePath, JSON.stringify(storageState, null, 2));

    return { accessToken, refreshToken, expiresAt, user };
}

export function getTokenFilePath(): string {
    return path.join(AUTH_CONFIG.AUTH_DIR, 'neko-token.json')
}

export function saveTokenFile(
    accessToken: string,
    refreshToken?: string,
    expireAt?: string
): void {
    const filePath = getTokenFilePath()
    fs.writeFileSync(filePath, JSON.stringify({
        token: accessToken,
        refresh_token: refreshToken,
        expires_at: expireAt
    }, null, 2))
}

export function loadTokenFile(): {
    token: string,
    refresh_toke?: string
    expire_at?: string
} | null {
    const filePath = getTokenFilePath()
    if (!fs.existsSync(filePath)) return null
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    catch {
        return null
    }
}