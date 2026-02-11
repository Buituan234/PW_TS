import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";
//import { newDashBoardPage} from "./Dashboard"

export class CRMLoginPage extends BasePage {
    //Khai báo locator
    private readonly emailInput = this.page.locator('#email')
    private readonly passwordInput = this.page.locator('#password')
    private readonly loginButton = this.page.getByRole('button', { name: 'Login' })

    async goto() {
        await this.page.goto('https://crm.anhtester.com/admin/authentication')
    }

    async expectOnPage(): Promise<void> {
        await expect(this.emailInput).toBeVisible()
        await expect(this.passwordInput).toBeVisible()
        await expect(this.page).toHaveURL(/admin\/authentication/)
    }

    async login(email: string, password: string) {
        await this.fillwithlog(this.emailInput, email)
        await this.fillwithlog(this.passwordInput, password, {isSensitive: true, fillOption: {timeout: 10000}})

        await this.clickwithlog(this.loginButton, {force: true})
        // Một số FW cũ sẽ dùng cách chuyển trang như này
        // được gọi là page chaining
        //return newDashBoardPage()
    }
    async expectLoggedIn() {
        await expect(this.page).toHaveURL(/admin/)
    }
}

// 3 nhược điểm chính của page chaining
// 1 vi phạm nguyên tắc trách nhiệm đơn lẻ
// đã ép thằng Login page phải gánh thêm 2 trách nhiệm mới
// 1: Biết logic điều hướng
// 2: Khởi tạo đối tượng
//
// 2. Tạo ra liên kết chặt chẽ (high coupling)
// thằng CRM login -> Tự nhiên phụ thuoocj vào thằng dashboard page
//.//

// Vấn đề thực tế:
// Câu hỏi 1: Điều gì xảy ra nếu đăng nhập thất bại?
// Nếu đăng nhập thất bại thì cũng vào dc trang Dashboard nên cần dùng thêm If else để check thêm
//Câu hỏi 2: Điều gi xảy ra nếu sau khi login page, admin vào admin page còn user thường thì vào new Dashboard page
// Cũng cần thêm if else để check role admin hay user
// Khó bảo trì và kém linh hoạt