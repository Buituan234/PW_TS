// Lấy ra các key mà mình cần sử dụng trong respone của api product 
export interface Product {
    id: number,
    name: string,
    type: 'bean'|'equipment'|'accessory',
    unit_type: 'kg'|'piece'|'box',
    price_per_unit: number,
    description?: string,
    is_active: boolean,
    created_at?: string,
    updated_at?: string
}

export interface PaginationResponse<T> {
    data: T[],
    pagination: {
        page: number,
        limit: number,
        total_items: number,
        total_pages: number,
    }
}