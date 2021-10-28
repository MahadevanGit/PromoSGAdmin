import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs';
import { LocalStorageMember } from '../../shared/models/common';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  localStorageMember = new LocalStorageMember();

  constructor(
    private auth: AuthService, 
    private router: Router) 
    { }

     canActivate(): Observable<boolean> {
       return this.auth.appUser$
       .map(appuser=> {
        if(appuser && appuser.isAdmin){
          return true;
        }
        else{
          this.router.navigate(['/dashboard']);
          return false;
        }});
    }
}

