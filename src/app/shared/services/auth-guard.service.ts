import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map'
import { ShopUserService } from 'src/app/shared/services/shop.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private shopUserService: ShopUserService,
    private router: Router) { }

  canActivate(route, state: RouterStateSnapshot) {
    return this.auth.user$.map(user => { //Check authentication
      if (user) {
        this.shopUserService.getShopUserById(user.uid).take(1).subscribe((value) => { //Check user exist in shops
          if (value) return true;
          else {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
          }
        })
        return true;
      }
      else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    });
  }
}
