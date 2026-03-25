import { test, expect } from '@playwright/test'
import { ChildProcess } from 'child_process'
import { get } from 'http'

test('TC01. Register -> Login -> Lấy JWWT token', async ({ request }) => {
    // Đăng kí
    const uniqueID = Date.now()
    const info = {
        userName: `tuan_${uniqueID}`,
        email: `tuan${uniqueID}@example.com`,
        password: '123456789'
    }
    const registerRes = await request.post('/auth/register',{
        data: info
    })
    const registerBody = await registerRes.json()

    expect(registerBody.access_token).toBeTruthy()
    expect(registerBody.token_type).toBe('Bearer')

    // Đăng nhập
    const loginRes = await request.post('/auth/login', {
        data: {
            username: info.userName,
            password: info.password
        }
    })
    expect(loginRes.status()).toBe(200)
    const loginBody = await loginRes.json()
    expect(loginBody.access_token).toBeTruthy()

    // Lấy JWT
    console.log(loginBody.access_token);
    
})

async function getToken(request: any): Promise<string>{
    const loginRes = await request.post('/auth/login', {
        data: {
            username: 'tuan1',
            password: '123456789'
        }
    })
    const loginBody = await loginRes.json()
    return loginBody.access_token
}

test('TC02. Query param - Lọc products theo type', async ({ request }) => {
    const access_token = await getToken(request)
    const getRes = await request.get('/api/products',{
        headers: {Authorization: `Bearer ${access_token}`},
        params: {
            type: 'equipment',
            limit: 2
        }
    })
    
    expect(getRes.status()).toBe(200)
    const getBody = getRes.json() as any

    console.log('Số sản phẩm', getBody.data?.length);

    for(const product of getBody.data){
        expect(product.type).toBe('equipment')
    }
    console.log('Tất cả các sản phẩm đều là type equipment');
    
})