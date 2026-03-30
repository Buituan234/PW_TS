export interface LoginPayLoad {
    email: string,
    password: string,
}

export interface AuthResponse {
    accessToken: string,
    user?:{
        id: number,
        email: string,
        username: string,
    },
    expiresIn: string,
    expiresAt: string,
}