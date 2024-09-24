import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "../services/cookie.service";

export const loggedGuard = async () => {
    const router = inject(Router);
    const cookieService = inject(CookieService);
    const tokenExist = await cookieService.tokenExistTC('access_token');
    if(tokenExist){
        router.navigate(['']);
        return false;
    }else{
        return true;
    }
}