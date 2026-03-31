// Lấy ra các key mà mình cần sử dụng trong respone của api product 
// export interface Product {
//     id: number,
//     name: string,
//     type: 'bean'|'equipment'|'accessory',
//     unit_type: 'kg'|'piece'|'box',
//     price_per_unit: number,
//     description?: string,
//     is_active: boolean,
//     created_at?: string,
//     updated_at?: string
// }

// export interface PaginationResponse<T> {
//     data: T[],
//     pagination: {
//         page: number,
//         limit: number,
//         total_items: number,
//         total_pages: number,
//     }
// }

export type ProductType = 'bean' | 'equipment' | 'accessory'
export type UnitType = 'kg' | 'piece' | 'box'
export type RoadLevel = 'Light' | 'Medium' | 'Dark'

export interface BrewGuide {
    method: string,
    ratio: string,
    temperature: string,
    time: string
}

export interface FlavorProfile {
    acidity: number;
    bitterness: number;
    floral: number;
    sweetness: number;
    notes: string[];
}

export interface BeanSpecifications {
    region: string;
    altitude: string;
    processing: string;
    grade: string;
    flavor_profile: FlavorProfile;
    brew_guide: BrewGuide,
    grin_options: string[];
    story: string;
    weight_options: number[]
}

export interface EquipmentSpecifications {
    brand: string;
    model: string;
    type: string;
    power: string;
    voltage: string;
    capacity: string;
    pressure: string;
    dimensions: string;
    weight: string;
    features: string[];
    includes: string[];
    color_options: string[];
}

export interface Product {
    id: number;
    name: string;
    type: ProductType;
    price_per_unit: number;
    unit_type: UnitType;
    origin: string;
    description: string;
    roast_level: RoadLevel;
    warranty_months: number;
    image_url: string;
    gallery: string[];
    specifications: BeanSpecifications | EquipmentSpecifications;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductCreate {
    name: string;
    type: ProductType;
    unit_type?: UnitType;
    origin?: string;
    description?: string;
    roast_level?: RoadLevel;
    price_per_unit?: number;
    warranty_months?: number;
    image_url?: string;
    gallery?: string[];
    specifications?: BeanSpecifications | EquipmentSpecifications;
}

export interface ProductUpdate extends ProductCreate {}

export interface ProductPatch {
    name?: string;
    type?: ProductType;
    unit_type?: UnitType;
    origin?: string;
    description?: string;
    roast_level?: RoadLevel;
    price_per_unit?: number;
    warranty_months?: number;
    image_url?: string;
    gallery?: string[];
    specifications?: BeanSpecifications | EquipmentSpecifications;
}

export interface Pagination {
    page: number,
        limit: number,
        total_items: number,
        total_pages: number,
}

export interface PaginationResponse<T> {
    data: T[],
    pagination: Pagination
}
