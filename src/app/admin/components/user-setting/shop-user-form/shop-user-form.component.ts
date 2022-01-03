import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ImageCategory, ImageDetailsFolder, LocalStorageMember } from 'src/app/shared/models/common';
import { AppUser } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { ShopUserService } from 'src/app/shared/services/shop.service';

@Component({
  selector: 'app-shop-user-form',
  templateUrl: './shop-user-form.component.html',
  styleUrls: ['./shop-user-form.component.scss'],
  providers: [AuthService, ShopUserService, ImageService]
})

export class ShopUserFormComponent implements OnInit {

  error: string;
  appUser: AppUser;
  authSubscription: Subscription;


  imageSubscription: Subscription;
  shopUserId: string;
  userId: any;
  profileImageList: any[];
  shopImageList: any[];
  remaningText: number = 0;

  get shopName() {
    return this.profileForm.get('shopName');
  }
  get firstName() {
    return this.profileForm.get('firstName');
  }
  get lastName() {
    return this.profileForm.get('lastName');
  }
  get telephone() {
    return this.profileForm.get('telephone');
  }
  get shopLogo() {
    return this.profileForm.get('shopLogo');
  }
  get shopPicture() {
    return this.profileForm.get('shopPicture');
  }
  get fax() {
    return this.profileForm.get('fax');
  }
  get hotline() {
    return this.profileForm.get('hotline');
  }
  get aboutShop() {
    return this.profileForm.get('aboutShop');
  }
  get weblink() {
    return this.profileForm.get('weblink') as FormArray;
  }

  constructor(
    private loader: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private shopUserService: ShopUserService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private flashMessageService: FlashMessageService
  ) {
    this.shopUserId = this.route.snapshot.paramMap.get('userId'); // for promoSG admin user only
    this.authSubscription = this.auth.appUser$.take(1).subscribe((user) => {
      this.appUser = user;
      this.updateProfile(this.appUser);
    })
  }


  profileForm = this.fb.group({
    shopName: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
    firstName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    lastName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    telephone: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]*$")])],
    shopLogo: ['', Validators.compose([Validators.required])],
    shopPicture: ['', Validators.compose([Validators.required])],
    fax: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern("^[0-9]*$")])],
    hotline: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]*$")])],
    aboutShop: ['', Validators.compose([Validators.required, Validators.minLength(50), Validators.maxLength(500)])],
    address: this.fb.group({
      block: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      level: [''],
      unit: [''],
      street: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      city: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      zip: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern("^[0-9]*$")])]
    }),
    weblink: this.fb.array([
      this.fb.control('')
    ])
  });

  ngOnInit() {
    this.userId = LocalStorageMember.get(LocalStorageMember.userId);
    this.getShoplogoImageList();
    this.getProfilelogoImageList();
  }


  async onSubmit() {
    let userData = this.profileForm.value;
    userData['email'] = this.appUser['email'];
    userData['userId'] = this.appUser.userId;
    userData['registeredAt'] = this.appUser.registeredAt;
    userData['weblink'] = this.removeWeblinkIfEmpty(userData['weblink']);
    userData['outletList'] = this.appUser['outletList'];
    console.log(userData);
    try {
      this.loader.show();
      var result = this.shopUserService.update(this.appUser.userId, userData); //un-comment if u want to save 
      //this.router.navigate(['/usersetting']);
    } catch (e) {
      //TODO: Need to check .. Currently could not catch exception
      this.flashMessageService.error('Something went wrong.')
    } finally {
      if ((await result).success) {
        this.flashMessageService.success((await result).message);
      } else {
        this.flashMessageService.error((await result).message);
      }

      this.loader.hide();
    }
  }

  onAboutShopChange(text: String) {
    this.remaningText = text ? text.length : 0;
  }

  updateProfile(appUser) {
    if (appUser && !appUser['weblink'])
      appUser['weblink'] = [];
    this.profileForm.patchValue({
      shopName: appUser ? appUser['shopname'] : '',
      firstName: appUser ? appUser['firstname'] : '',
      lastName: appUser ? appUser['lastname'] : '',
      email: appUser ? appUser['email'] : '',
      telephone: appUser ? appUser['telephone'] : '',
      shopLogo: appUser ? appUser['shopLogo'] : '',
      shopPicture: appUser ? appUser['shopPicture'] : '',
      fax: appUser ? appUser['fax'] : '',
      hotline: appUser ? appUser['hotline'] : '',
      aboutShop: appUser ? appUser['aboutShop'] : '',
      weblink: appUser && appUser['weblink'] ? this.assignWebLink(appUser['weblink']) : '',
      address: {
        block: appUser && appUser['address'] ? appUser['address']['block'] : '',
        level: appUser && appUser['address'] ? appUser['address']['level'] : '',
        unit: appUser && appUser['address'] ? appUser['address']['unit'] : '',
        street: appUser && appUser['address'] ? appUser['address']['street'] : '',
        city: appUser && appUser['address'] ? appUser['address']['city'] : '',
        zip: appUser && appUser['address'] ? appUser['address']['zip'] : '',
      },
    });
  }

  addWebLink() {
    //if(canAddWebLink)
    this.weblink.push(this.fb.control(''));
  }

  addWebLinkDisable() {
    var canAddWebLink = false;
    this.weblink.value.filter(function (el) {
      if (el == null || el == '')
        canAddWebLink = true;
    });

    return canAddWebLink;
  }

  removeWeblink(control) {
    this.weblink.removeAt(control)
  }

  assignWebLink(weblink: any): any {
    if (weblink && weblink.length > 0) {
      weblink.forEach(ele => {
        this.addWebLink();
      });
    }
    return weblink;
  }

  removeWeblinkIfEmpty(weblink: any) {
    var weblinkFilterd = weblink.filter(function (el) {
      return el != null && el != '';
    });
    return weblinkFilterd;
  }

  getShoplogoImageList() {
    try {
      this.loader.show();
      this.imageSubscription = this.imageService
        .getImageListByCategory(ImageCategory.shoplogo, ImageDetailsFolder.usersetting, this.userId).take(1).subscribe((value) => {
          this.shopImageList = [];
          value.forEach((img) => {
            Object.keys(img).length;
            this.shopImageList.push(img)
          });
        });
    } catch (error) {

    } finally {
      this.loader.hide();
    }

  }

  getProfilelogoImageList() {
    try {
      this.loader.show();
      this.imageSubscription = this.imageService
        .getImageListByCategory(ImageCategory.profilelogo, ImageDetailsFolder.usersetting, this.userId).take(1).subscribe((value) => {
          this.profileImageList = [];
          value.forEach((img) => {
            Object.keys(img).length;
            this.profileImageList.push(img)
          });
        });
    } catch (error) {

    } finally {
      this.loader.hide();
    }
  }

}


