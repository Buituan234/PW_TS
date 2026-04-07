import { Page } from "@playwright/test"

export class TabManager {
    // Record > Là object nhưng mà mình có thể tùy biến bao nhiêu phần tử cũng được
    // Phụ thuộc vào key và value

    // Record<string, page>
    //{
    // "invoice": page2,
    //"invoice: page3"
    //}
    // Tập hợp các tab  và window
    private tabs: Record<string, Page> = {}

    // Lưu tên của tab đang active có thể là string hoặc null
    private _currentName: string | null = null

    get current(): Page | null {
        if (!this._currentName) return null
        return this.tabs[this._currentName] || null
    }

    get(name: string): Page | null {
        return this.tabs[name] || null
    }

    get currentName(): string | null {
        return this._currentName
    }

    // Đếm số tab đang mở
    get count(): number {
        return Object.keys(this.tabs).length
    }

    // Thêm tab hoặc window pop-up
    add (name: string, page: Page): void {
        this.tabs[name] = page

        // Nếu chưa có tab active (null) > Tab đầu tiên tự động là active
        if(this._currentName === null){
            this._currentName = name
        }
        console.log(`Added ${name} (Total: ${this.count})`);
        
    }

    // Switch sang một tab khác
    // page.bringToFront()
    async switchTo(name: string): Promise<Page>{
        const page = this.tabs[name]
        if (!page){
            throw new Error(`Tab ${name} không tồn tại`)
        }
        //Focus vào tab này
        await page.bringToFront()

        // Cập nhật tên tab đang active
        this._currentName = name
        console.log(`Switched to ${name}`);
        return page
    }

    // page.close() > Đóng 1 cái tab
    async close(name: string): Promise<void> {
        const page = this.tabs[name]

        if (page){
            await page.close()
            delete this.tabs[name]
            console.log(`Closed ${name}`);
            
            // Nếu vừa đóng tab đang active
            if ( this._currentName === name) {
                const remaning = Object.keys(this.tabs)
                this._currentName = remaning.length > 0 ? remaning[0] : null
            }
        }
    }

    status(): void {
        console.log('TAB MANAGER STATUS');
        console.log(`Active ${this._currentName || 'none'}`);
        console.log(`Total ${this.count} tabs`);
        
        for (const name in this.tabs){
            console.log(`Đang có ${this.tabs[name].url()}`);
        }
    }

}