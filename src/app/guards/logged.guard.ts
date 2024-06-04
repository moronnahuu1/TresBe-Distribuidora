import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const loggedGuard = () => {
    const router = inject(Router);
    if(localStorage.getItem("userLogged")){
        router.navigate(['']);
        return false;
    }else{
        return true;
    }
}