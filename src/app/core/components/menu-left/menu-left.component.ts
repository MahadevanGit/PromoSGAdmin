import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageMember } from 'src/app/shared/models/common';
import { AppUser } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { animateText, onSideNavChange } from '../../animations/animations';
import { SidenavService } from '../../services/sidenav.service';

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
  animations: [onSideNavChange, animateText],
  providers: [AuthService]
})
export class MenuLeftComponent implements OnInit, OnDestroy {

  appUserSubscription: Subscription;
  appUser: AppUser;
  localStorageMember = new LocalStorageMember();
  personName: string;
  public sideNavState: boolean = false;
  public linkText: boolean = false;
  public pages: Page[] = [];

  constructor(
    private _sidenavService: SidenavService,
    public auth: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    this.appUserSubscription = this.auth.appUser$.subscribe((appUser) => {
      this.appUser = appUser;
      this.personName = this.appUser && this.appUser.firstName ? this.appUser.firstName.substring(0, 18) : this.appUser && this.appUser.email ? this.appUser.email.split("@")[0] : '';
      this.pages = [];
      if (this.appUser) {
        let page: Page = { name: this.personName, link: '/usersetting', icon: 'person', selected: false };
        this.pages.push(page);
        page = { name: 'Dashboard', link: '/dashboard', icon: 'dashboard', selected: false }
        this.pages.push(page);
        if (this.appUser && this.appUser.isAdmin) {
          page = { name: 'Setting', link: '/adminsetting', icon: 'settings', selected: false }
          this.pages.push(page);
        }
      }
      else {
        this.pages = [];
      }
    });
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidenavService.sideNavState$.next(this.sideNavState)
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
    this.localStorageMember.clear();
    localStorage.clear();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.appUserSubscription.unsubscribe();
  }

}