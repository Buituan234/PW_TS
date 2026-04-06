import { ImageUploadResponse, PaginationResponse, Product, ProductCreate, ProductPatch, ProductUpdate } from "../interfaces/product.interface";
import { BaseService } from "./BaseService";

export class ProductService extends BaseService {
    private readonly basePath = '/api/products'

    async getProducts(params?: {
        page?: number,
        limit?: number,
        type?: string,
    }): Promise<PaginationResponse<Product>> {
        return this.get<PaginationResponse<Product>>(this.basePath, {
            params: params
        })
    }

    async getProduct(id: number): Promise<Product> {
        return this.get<Product>(`${this.basePath}/${id}`)
    }

    //Luồng CRUD => Create Read Update Delete

    async createProduct(data: ProductCreate): Promise<Product>{
        return await this.post<Product, ProductCreate>(this.basePath, data)
    }

    async updateProduct(id: number, data: ProductUpdate): Promise<Product>{
        return this.put<Product, ProductUpdate>(`${this.basePath}/${id}`, data)
    }

    async patchProduct(id: number, data: ProductPatch): Promise<Product>{
        return this.patch<Product, ProductPatch>(`${this.basePath}/${id}`, data)
    }

    async deleteProduct(id: number): Promise<void>{
        return await this.delete(`${this.basePath}/${id}`)
    }

    async uploadImage(
        productId: number,
        imageFile: {name: string, mimeType: string, buffer: Buffer},
        baseUrl: string
    ): Promise<ImageUploadResponse>{
        return this.post<ImageUploadResponse, undefined>(`${this.basePath}/${productId}/image`, undefined, {
            multipart: {image: imageFile},
            baseURL:baseUrl
        })
    }
}