import { test, expect } from '@playwright/test'

test('GET - lấy thông tin bài viết số 1', async({request}) => {
    //1 Gửi yêu cầu tới endpoint /posts/1
    const response = await request.get('/posts/1')
    const status = response.status()
    const statusText = response.statusText()
    console.log(status);
    console.log(statusText);
    
    
    const body = await response.json()
    console.log('GET response',  body);
    expect(body.id).toBe(1)
    expect(body.userId).toBe(1)
})