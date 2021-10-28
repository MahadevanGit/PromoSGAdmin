import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {

  imageRequestType: string =  'usersetting'; //'product';
  //imageListRoutePath: string = 'image-gallery'; //'/image/list';
  rootPath: string = 'shop-user-content/current-user-id/usersetting-imageDetails/';
  imageFolderName: string = '/usersetting-imageDetails/';

  userId: string;
  auth_subscription: Subscription;
  isAdmin: boolean;
  
  constructor(private auth: AuthService) { 
    // this.auth_subscription = this.auth.appUser$.subscribe(_user=> { 
    //   this.isAdmin = _user.isAdmin;
    //   this.userId = _user.userId; 
    // });
  }

  ngOnInit(): void {
  }

}
