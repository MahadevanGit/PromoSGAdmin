import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStorageMember } from 'src/app/shared/models/common';
import { AppUser } from 'src/app/shared/models/user';
import { ShopUserService } from 'src/app/shop.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers:[ShopUserService]
})
export class DashboardComponent implements OnInit,OnDestroy {

  appUser: AppUser;
  appUserObject: any;
  appUserList: any[] = [];
  appUserSubscription: Subscription; 
  appAllUserSubscription: Subscription;
  localStorageMember = new LocalStorageMember();
  isAdmin: boolean = false;
  imgSrc: string = '/assets/images/image-placeholder.png';

  constructor(private shopUserService: ShopUserService) {
   }

  async ngOnInit(): Promise<void> {
    this.getAppUsers();
  }

   getAppUsers(){

  this.appUserSubscription = this.shopUserService.get(this.localStorageMember.get(this.localStorageMember.userId))
                    .subscribe((value) => { 
                      if(value && value.isAdmin){
                          this.isAdmin = value.isAdmin;
                          this.appUserList = [];
                          this.appAllUserSubscription = this.shopUserService
                                      .getAllUser()
                                      .subscribe((value) => { 
                                        Object.values(value).forEach(appUser => {
                                          if(!appUser['isAdmin'])
                                          this.appUserList.push(appUser)
                                        })
                          });

                        }else
                          this.appUserList.push(value); 
    });
    return this.appUserList;
  }

  ngOnDestroy(): void {
    if(this.appUserSubscription) this.appUserSubscription.unsubscribe();
    if(this.appAllUserSubscription) this.appAllUserSubscription.unsubscribe();
  }

}
