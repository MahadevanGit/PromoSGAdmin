import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageMember } from 'src/app/shared/models/common';
import { ShopUser } from 'src/app/shared/models/shop';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'promoSg-navbar-header',
  templateUrl: './navbar-header.component.html',
  styleUrls: ['./navbar-header.component.scss']
})

export class NavbarHeaderComponent {

  appUserSubscription: Subscription;
  appUser: ShopUser;
  localStorageMember = new LocalStorageMember();

  @Input() sidenav: MatSidenav

  constructor(
    public auth: AuthService,
    private router: Router) {
    this.appUserSubscription = auth.appUser$.subscribe((appUser) => {
      this.appUser = appUser;
    });
  }

  ngOnDestroy(): void {
    this.appUserSubscription.unsubscribe();
  }

  logout() {
    LocalStorageMember.clear();
    localStorage.clear();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
