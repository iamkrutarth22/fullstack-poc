import type { IUser } from "./IUser";

export interface IAuthentication{
    isAuthenticated:boolean,
    accessToken:string|null,
    refreshToken:string|null,
    user:IUser|null,
}


