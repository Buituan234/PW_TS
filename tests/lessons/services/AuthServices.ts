import { BaseService } from "./BaseService";
import { AuthResponse } from "../interfaces/auth.interface";


export class AuthService extends BaseService {
    private currentToken: string | null = null

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await this.postRaw('/auth/login',{
        username: email,
        password: password,
        })

        if(!response.ok()){
            throw new Error(`Login failed: ${response.status()}`)
        }
        const authData = await response.json()
        const token = authData.access_token
        this.currentToken = token
        return {
            access_token: token,
            user: authData.user,
            expires_in: authData.expires_in,
        }
    }
    getToken(): string|null {
        return this.currentToken
    }

    setToken(token: string): void{
        this.currentToken = token
    }
    getAuthHeaders(): Record<string, string> {
        if(!this.currentToken){
            return{}
        }
        return {
            Authorization: `Bearer ${this.currentToken}`
        }
    }
}