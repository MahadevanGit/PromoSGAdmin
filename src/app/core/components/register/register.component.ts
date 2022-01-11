import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ShopUserService } from 'src/app/shared/services/shop.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  error: string;

  get shopName() {
    return this.profileForm.get('shopName')
  }
  get firstName() {
    return this.profileForm.get('firstName')
  }
  get lastName() {
    return this.profileForm.get('lastName')
  }
  get pemail() {
    return this.profileForm.get('email')
  }
  get password() {
    return this.profileForm.get('password')
  }


  constructor(
    private loader: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private shopUserService: ShopUserService
  ) { }


  profileForm = this.fb.group({
    shopName: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
    firstName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    lastName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
  });

  // async onSubmit1() {
  //   // TODO: Use EventEmitter with form value
  //   console.warn(this.profileForm.value);
  // }

  async onSubmit() {
    let userData = this.profileForm.value;
    let resp;
    try {
      this.loader.show();
      await this.auth.registerUser(userData).then(x => resp = x);

      if (resp && resp.success) {
        this.shopUserService.save(userData);
        this.router.navigate(['/dashboard']);
      }
      this.error = resp.message;

    } catch (e) {
      //TODO: Need to check .. Currently could not catch exception
    } finally {
      this.loader.hide();
    }
  }

  // updateProfile(appUser) {
  //   // this.profileForm.patchValue({
  //   //   shopName: appUser['shopname'],
  //   //   firstName: appUser['firstname'],
  //   //   lastName: appUser['lastname'],
  //   //   email: appUser['email']
  //   // });
  // }
}
