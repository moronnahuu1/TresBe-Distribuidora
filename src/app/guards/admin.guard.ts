import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "../services/cookie.service";

export const adminGuard = async () => {
    const router = inject(Router);
    const cookieService = inject(CookieService);
    const tokenExist = await cookieService.tokenExistTC('admin_token');
    if(tokenExist){
        return true;
    }else{
        router.navigate(['']);
        return false;
    }
}