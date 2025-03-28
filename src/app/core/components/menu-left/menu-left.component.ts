import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageMember } from '../../../shared/models/common';
import { ShopUser } from '../../../shared/models/shop';
import { AuthService } from '../../../shared/services/auth.service';

interface Page {
  link: string;
  name: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'promo-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],
  providers: [AuthService]
})
export class MenuLeftComponent implements OnInit, OnDestroy {

  appUserSubscription: Subscription;
  appUser: ShopUser;
  localStorageMember = new LocalStorageMember();
  personName: string;
  public linkText: boolean = false;
  public pages: Page[] = [];

  constructor(
    public auth: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    this.appUserSubscription = this.auth.appUser$.subscribe((appUser) => {
      this.appUser = appUser;
      this.personName = this.appUser && this.appUser.firstname ? this.appUser.firstname.substring(0, 18) : this.appUser && this.appUser.email ? this.appUser.email.split("@")[0] : '';
      this.pages = [];
      if (this.appUser) {
        this.pages = [
          { name: this.personName, link: '/usersetting', icon: 'person', selected: false },
          { name: 'Customers', link: '/customers', icon: 'people', selected: false },
          { name: 'Promo cards', link: '/promocarddb', icon: 'stars', selected: false },
          { name: 'Products', link: '/products', icon: 'playlist_add', selected: false },
          { name: 'Statistics', link: '/statisticsdbd', icon: 'bar_chart', selected: false },
        ];
        if (this.appUser && this.appUser.isAdmin) {
          this.pages = [
            { name: 'Dashboard', link: '/dashboard', icon: 'dashboard', selected: false },
            { name: 'Setting', link: '/adminsetting', icon: 'settings', selected: false }
          ];
        }
      }
      else {
        this.pages = [];
      }
    });
  }

  onClick(page: Page) {
    this.pages && page && this.pages.forEach((p) => {
      if (p.name == page.name)
        p.selected = true;
      else
        p.selected = false;
    })
  }

  logout() {
    LocalStorageMember.clear();
    localStorage.clear();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.appUserSubscription.unsubscribe();
  }

}