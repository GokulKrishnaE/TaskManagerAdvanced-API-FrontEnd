import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map } from "rxjs";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";

import { CustomJwtPayload } from "../models/customJwtPayload.modal";

@Injectable({
    providedIn: "root"
})


export class AuthService{

    constructor(
        private apiService:ApiService,
        private router: Router
    ){}

    login(loginPayload:any){
        return this.apiService.post('user/login',loginPayload)
        .pipe(map((res:any)=>{
            try{
                if (!res.token) {
                    return { success: false, message: 'No token received' };
                }
                const user = jwtDecode<CustomJwtPayload>(res.token)
                if (!user || !user.exp || Date.now() >= user.exp * 1000) {
                    return { success: false, message: 'Token is invalid or expired' };
                }
                localStorage.setItem('netKey',res.token)
                localStorage.setItem('userId',String(user.sub))
                const roles = Array.isArray(user.role) ? user.role : [user.role];
                localStorage.setItem('Roles', JSON.stringify(roles))
                localStorage.setItem('fullName', String(user.fullName))

                return { success: true, message: 'login success' };
            }
            catch(err){
                return { success: false, message: 'Something went wrong' }; 
            }
        }))
    }

    logout(){
        localStorage.clear()
        this.router.navigate(['/login'])
    }

    getToken():string | undefined{
        return localStorage.getItem('netKey')?.toString()
    }

    getUserId():string | undefined{
        return localStorage.getItem('userId')?.toString()
    }

    getUserFullName():string | undefined{
        return localStorage.getItem('fullName')?.toString()
    }

    getUserRoles(): string[] {
        const roles = localStorage.getItem('Roles');
        return roles ? JSON.parse(roles) : [];
    }

    getUserRole(): string {
        const roles = JSON.parse(localStorage.getItem('Roles') || '[]');
        if (roles.includes('Admin') || roles.includes('GlobalAdmin')) return 'admin';
        else return 'user';
    }
      
    getBasePath(): string {
    return `/${this.getUserRole()}`;
    }

}