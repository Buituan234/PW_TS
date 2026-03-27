import { test, expect, APIRequestContext } from '@playwright/test'

test('TC01. Register -> Login -> Lấy JWWT token', async ({ request }) => {
    // Đăng kí
    const uniqueID = Date.now()
    const info = {
        userName: `tuan_${uniqueID}`,
        email: `tuan${uniqueID}@example.com`,
        password: '123456789'
    }
    const registerRes = await request.post('/auth/register', {
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

async function getToken(request: APIRequestContext): Promise<string> {
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
    const getRes = await request.get('/api/products', {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
            type: 'equipment',
            limit: 2
        }
    })

    expect(getRes.status()).toBe(200)
    const getBody = await getRes.json() as any

    console.log('Số sản phẩm', getBody.data?.length);

    if (getBody.data?.length > 0) {
        for (const product of getBody.data) {
            expect(product.type).toBe('equipment')
        }
        console.log('Tất cả các sản phẩm đều là type equipment');
    }
})

test('TC03. Path param - Lấy product theo id', async ({ request }) => {
    const access_token = await getToken(request)
    const listRes = await request.get('/api/products', {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
            limit: 2,
            type: 'equipment'
        }
    })
    expect(listRes.status()).toBe(200)
    const listBody = await listRes.json() as any
    expect(listBody.data?.length).toBeGreaterThan(0)
    const id = listBody.data?.[0]?.id

    const getRes = await request.get(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
    })
    expect(getRes.status()).toBe(200)
    const getBody = await getRes.json()
    expect(getBody.id).toBe(id)
    console.log('Tên sản phẩm là: ', getBody.name);
    console.log('Số tiền của sản phẩm là: ', getBody.price_per_unit);
})

test('TC04. Kiểm tra kết quả trả về có đúng số lượng yêu cầu', async ({ request }) => {
    const access_token = await getToken(request)
    const listRes = await request.get('/api/products', {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
            page: 1,
            limit: 5,
        }
    })
    expect(listRes.status()).toBe(200)
    const listBody = await listRes.json() as any
    expect(listBody.data?.length).toBe(5)
    console.log('Số sản phẩm trả về là: ', listBody.data?.length);
})

test('TC05. Kiểm tra các item của page 2 khác với page 1', async ({ request }) => {
    const access_token = await getToken(request)
    const listRes1 = await request.get('/api/products', {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
            page: 1,
            limit: 5,
        }
    })
    expect(listRes1.status()).toBe(200)
    const listBody1 = await listRes1.json()
    const listRes2 = await request.get('/api/products', {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
            page: 2,
            limit: 5,
        }
    })
    expect(listRes2.status()).toBe(200)
    const listBody2 = await listRes2.json()
    const idPage1: string[] = []
    for (const item of listBody1.data) {
        idPage1.push(item.id)
    }
    const idPage2: string[] = []
    for (const item of listBody2.data) {
        idPage2.push(item.id)
    }
    console.log('ID của các item trong page 1 là: ', idPage1);
    console.log('ID của các item trong page 2 là: ', idPage2);
    expect(idPage1).not.toEqual(idPage2)
    console.log('Các item trong page 1 khác page 2');
})

test('TC06. Multipart form - Gửi các text field', async ({ request }) => {

    // const access_token = await getToken(request)
    // multipart form api không cần access_token
    const listRes = await request.post('/public/test/echo-form', {
        multipart:{
            name: 'Bui bui',
            age: '24',
            email: 'btuan@gmail.com',
        }
    })
    expect(listRes.status()).toBe(200)
    const listBody = await listRes.json()
    console.log('Tên người dùng là ',listBody.form_fields.name);
    console.log('Tuổi người dùng là ',listBody.form_fields.age);
    console.log('Email người dùng là ',listBody.form_fields.email);
})

test('TC07. Multipart form - Gửi txt file', async ({ request }) => {
    const text = Buffer.from('Tôi tên là tuấn')
    const listRes = await request.post('/public/test/echo-form', {
        multipart:{
            name: 'Bui bui',
            age: '24',
            email: 'btuan@gmail.com',
        }
    })
    expect(listRes.status()).toBe(200)
    const listBody = await listRes.json()
    console.log('Tên người dùng là ',listBody.form_fields.name);
    console.log('Tuổi người dùng là ',listBody.form_fields.age);
    console.log('Email người dùng là ',listBody.form_fields.email);
})

test('TC07. URL encode', async ({ request }) => {
    // const access_token = await getToken(request)
    const response = await request.post('/public/test/echo-urlencoded',{
        form: {
            userName: 'Nguyễn Văn B',
            email: 'b@gmail.com',
            message: 'abc',
            password: 'P@ass word&123'
        }
    })
    
    const resBody = await response.json()
    console.log(resBody);
})