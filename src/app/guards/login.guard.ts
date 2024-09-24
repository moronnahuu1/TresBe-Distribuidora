import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "../services/cookie.service";

export const loginGuard = async() => {
    const router = inject(Router);
    const cookieService = inject(CookieService);
    const tokenExist = await cookieService.tokenExistTC('access_token');
    if(tokenExist){
        return true;
    }else{
        router.navigate(['/login']);
        return false;
    }
}