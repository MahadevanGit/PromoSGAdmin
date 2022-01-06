import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuIconDdComponent } from 'src/app/shared/components/control/menu-icon-dd/menu-icon-dd.component';
import { MatMenuListItem } from 'src/app/shared/models/common';
import { ShopUser } from 'src/app/shared/models/shop';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {

  appUser: ShopUser;

  imageRequestType: string = 'usersetting'; //'product';
  //imageListRoutePath: string = 'image-gallery'; //'/image/list';
  rootPath: string = 'shop-user-content/current-user-id/usersetting-imageDetails/';
  imageFolderName: string = '/usersetting-imageDetails/';

  userId: string;
  authSubscription: Subscription;
  isAdmin: boolean;

  selectedMenuItem: string;
  defaultSelection: MatMenuListItem;
  menuListItems: MatMenuListItem[];

  constructor(
    public menuiconcomp: MenuIconDdComponent, // MyNote: This is child component injection way 1. way 2 is using @ViewChild.
    private auth: AuthService
  ) {
    this.authSubscription = this.auth.appUser$.take(1).subscribe((user) => {
      this.appUser = user;
    });
  }

  ngOnInit(): void {
    this.loadMatMenuListItem();
  }

  async loadMatMenuListItem() {
    this.menuListItems = this.menuListItems = [
      {
        menuLinkText: 'Shop Information',
        menuLinkKey: 'personnel-form',
        menuIcon: 'shop',
        isDisabled: false,
        selected: true
      },
      {
        menuLinkText: 'Add Outlets',
        menuLinkKey: 'outlet-form',
        menuIcon: 'add_location',
        isDisabled: false,
        selected: false
      },
      {
        menuLinkText: 'Add Terms & Con',
        menuLinkKey: 'tc-form',
        menuIcon: 'add_box',
        isDisabled: false,
        selected: false
      },
      {
        menuLinkText: 'Add Image',
        menuLinkKey: 'image-form',
        menuIcon: 'add_photo_alternate',
        isDisabled: false,
        selected: false
      },
      {
        menuLinkText: 'Shop Image Gallery',
        menuLinkKey: 'image-gallery',
        menuIcon: 'collections',
        isDisabled: false,
        selected: false
      }
    ];
    this.onChildComplete();
  }

  isProductFormDone(isProductFormDone: boolean) {
    if (isProductFormDone)
      this.onChildComplete();
  }

  public onSelect(menuLinkKey: string): void {
    if (menuLinkKey == 'product-form') {
    }
    this.selectedMenuItem = menuLinkKey;
  }

  public onChildComplete(data?: any): void {
    if (this.menuListItems) {
      this.defaultSelection = this.menuListItems ? this.menuListItems[0] : null;
      this.menuiconcomp.clickMenuItem(this.defaultSelection);
      this.onSelect(this.defaultSelection.menuLinkKey);
    }
    else
      this.loadMatMenuListItem();
  }

}
