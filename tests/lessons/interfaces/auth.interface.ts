export interface LoginPayLoad {
    email: string,
    password: string,
}

export interface AuthResponse {
    access_token: string,
    user?:{
        id: number,
        email: string,
        username: string,
    },
    expires_in: string
}