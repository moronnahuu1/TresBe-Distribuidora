import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const adminGuard = () => {
    const router = inject(Router);
    if(localStorage.getItem("admin")){
        return true;
    }else{
        router.navigate(['']);
        return false;
    }
}