import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import { LocalStorageMember } from 'src/app/shared/models/common';
import { ShopUser } from 'src/app/shared/models/shop';
import { AuthService } from '../../../shared/services/auth.service';
import { onMainContentChange } from '../../animations/animations';
import { SidenavService } from '../../services/sidenav.service';



@Component({
  selector: 'promoSg-bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss'],
  animations: [onMainContentChange],
  providers: [AuthService]
})
export class BsNavbarComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  appUserSubscription: Subscription;
  sideNavSubscription: Subscription;
  appUser: ShopUser;
  localStorageMember = new LocalStorageMember();
  public onSideNavChange: boolean;

  constructor(
    public auth: AuthService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    private _sidenavService: SidenavService,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.appUserSubscription = auth.appUser$.subscribe(appUser => this.appUser = appUser);

    // this.sideNavSubscription = this._sidenavService.sideNavState$.subscribe( res => {
    //   console.log(res)

    //   this.onSideNavChange = res;
    //})

    // this.mobileQuery = media.matchMedia('(max-width: 600px)');
    // this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('ng on destroy from bs-navbar');
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.appUserSubscription.unsubscribe();
    this.sideNavSubscription.unsubscribe();
  }



  logout() {
    LocalStorageMember.clear();
    localStorage.clear();
    this.auth.logout();
    this.router.navigate(['/login']);
  }



}


