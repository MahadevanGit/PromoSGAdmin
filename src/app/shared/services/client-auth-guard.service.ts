import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientAuthGuard implements CanActivate {

  constructor(private auth: AuthService,
    private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.auth.appUser$
      .map(appuser => {
        if (appuser && !appuser.isAdmin) {
          return true;
        }
        else {
          this.router.navigate(['/dashboard']);
          return false;
        }
      });
  }

}
