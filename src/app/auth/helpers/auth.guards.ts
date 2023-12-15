import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthenticationService } from "app/auth/service/authentication.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class AuthGuard {
    constructor (private authServices: AuthenticationService, private _router: Router){}
    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let check = this.authServices.isAuthenticated()
    if(!check)
    {
      return this._router.navigate(['/pages/authentication/login-v2'], { queryParams: { returnUrl: state.url } });
    }
     return true
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this.canActivate(childRoute,state)
    }
}