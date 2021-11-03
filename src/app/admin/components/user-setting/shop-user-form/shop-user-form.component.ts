import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppUser } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ShopUserService } from 'src/app/shop.service';

@Component({
  selector: 'app-shop-user-form',
  templateUrl: './shop-user-form.component.html',
  styleUrls: ['./shop-user-form.component.scss'],
  providers:[AuthService]
})

export class ShopUserFormComponent implements OnInit {

  error: string;
  appUser: AppUser;
  authSubscription: Subscription;

  get shopName(){
    return this.profileForm.get('shopName');
    }
  get firstName(){
    return this.profileForm.get('firstName');
    }
  get lastName(){
    return this.profileForm.get('lastName');
    }
  get telephone(){
      return this.profileForm.get('telephone');
    }
  get fax(){
      return this.profileForm.get('fax');
    }
  get hotline(){
      return this.profileForm.get('hotline');
    }
  get weblink() {
    return this.profileForm.get('weblink') as FormArray;
  }
  
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private auth: AuthService,
      private shopUserService: ShopUserService
  ) {
    this.authSubscription = this.auth.appUser$.take(1).subscribe((user)=>{
      this.appUser = user;
      this.updateProfile(this.appUser);
      console.log(this.fb)
    })
  }
    

  profileForm = this.fb.group({
    shopName: ['', Validators.compose([Validators.required,Validators.minLength(5)])],
    firstName: ['', Validators.compose([Validators.required,Validators.minLength(2)])],
    lastName: ['', Validators.compose([Validators.required,Validators.minLength(2)])],
    telephone: ['', Validators.compose([Validators.required,Validators.minLength(8),Validators.pattern("^[0-9]*$")])],
    fax: ['', Validators.compose([Validators.required,Validators.minLength(6),Validators.pattern("^[0-9]*$")])],
    hotline: ['', Validators.compose([Validators.required,Validators.minLength(8),Validators.pattern("^[0-9]*$")])],
    address: this.fb.group({
      block: ['',Validators.compose([Validators.required,Validators.minLength(1)])],
      level: [''],
      unit: [''],
      street: ['',Validators.compose([Validators.required,Validators.minLength(2)])],
      city: ['',Validators.compose([Validators.required,Validators.minLength(2)])],
      zip: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.pattern("^[0-9]*$")])]
    }),
    weblink: this.fb.array([
      this.fb.control('')
    ])
  });

  ngOnInit() {
    console.log(this.fb)
   }

  async onSubmit() {
    let userData = this.profileForm.value;
    console.log(userData)
    userData['email'] = this.appUser['email'];
    userData['userId'] = this.appUser.userId;
    userData['registeredAt'] = this.appUser.registeredAt;
    userData['weblink'] = this.removeWeblinkIfEmpty(userData['weblink']);
    console.log(this.appUser['address'])
       try {
        this.shopUserService.update(this.appUser.userId,userData); //un-comment if u want to save 
        this.router.navigate(['/usersetting']);
        //Show flash message .. successfully updated..
       } catch (e) {
          //TODO: Need to check .. Currently could not catch exception
       }
  }

  

  

  updateProfile(appUser) {
    if(appUser && !appUser['weblink'])
      appUser['weblink'] = [];
    this.profileForm.patchValue({
      shopName: appUser ? appUser['shopname'] : '',
      firstName: appUser ? appUser['firstname']: '',
      lastName: appUser ? appUser['lastname']: '',
      email: appUser ? appUser['email']: '',
      telephone: appUser ? appUser['telephone']: '',
      fax: appUser ? appUser['fax']: '',
      hotline: appUser ? appUser['hotline']: '',
      weblink: appUser && appUser['weblink'] ? this.assignWebLink(appUser['weblink']) : '',
      address: {
        block: appUser && appUser['address'] ? appUser['address']['block']: '',
        level: appUser && appUser['address'] ? appUser['address']['level']: '',
        unit: appUser && appUser['address'] ? appUser['address']['unit']: '',
        street: appUser && appUser['address'] ? appUser['address']['street']: '',
        city: appUser && appUser['address'] ? appUser['address']['city']: '',
        zip: appUser && appUser['address'] ? appUser['address']['zip']: '',
      },
    });
  }

  addWebLink() {
    //if(canAddWebLink)
    this.weblink.push(this.fb.control(''));
  }

  addWebLinkDisable(){
    var canAddWebLink = false;
    this.weblink.value.filter(function (el) {
      if(el == null || el == '')
        canAddWebLink = true;
    });

    return canAddWebLink;
  }

  removeWeblink(control){
    this.weblink.removeAt(control)
  }

  assignWebLink(weblink: any): any {
    if(weblink && weblink.length > 0){
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

}


