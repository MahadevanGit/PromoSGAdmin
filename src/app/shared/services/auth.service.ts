import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ShopUserService } from 'src/app/shared/services/shop.service';
import { LocalStorageMember, Result } from '../models/common';
import { AppUser } from '../models/user';
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/observable/of'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  localStorageMember = new LocalStorageMember();

  private result: Result = { success: false, message: "" };
  user$: Observable<any>; //firebase.User;

  constructor(
    private shopUserService: ShopUserService,
    public afAuth: AngularFireAuth,
    private route: ActivatedRoute) {
    this.user$ = this.afAuth.authState;
  }

  get appUser$(): Observable<AppUser> {
    return this.user$
      .switchMap(
        user => {
          if (user) {
            return this.shopUserService.get(user.uid)
          }
          return Observable.of(null);
        });
  }

  async registerUser(userData: any): Promise<Result> {

    try {
      await this.afAuth.createUserWithEmailAndPassword(userData.email, userData.password);
      this.result.success = true;
      this.result.message = 'Successfully registered.';
      let userId = (await this.afAuth.currentUser).uid;
      LocalStorageMember.add(LocalStorageMember.userId, userId); //This is need for save the user data with google user id 
      return this.result;
    } catch (error) {
      //TODO: Need to check .. Currently could not catch exception
      this.result.success = false;
      this.result.message = error.message;
      return this.result;
    }
  }

  async loginUser(userData: any) {
    try {
      let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
      LocalStorageMember.add(LocalStorageMember.returnUrl, returnUrl);

      try {
        await this.afAuth.signInWithEmailAndPassword(userData.email, userData.password)
      } catch (error) {
        this.result.success = false;
        this.result.message = error.message;
        return this.result;
      }
      let userId = (await this.afAuth.currentUser).uid;
      LocalStorageMember.add(LocalStorageMember.userId, userId); //This is need for save the user data with google user id 
      this.result.success = true;
      this.result.message = 'Successfully logged in.';
      return this.result;
    } catch (error) {
      //TODO: Need to check .. Currently could not catch exception
      this.result.success = false;
      this.result.message = error.message;
      return this.result;
    }
  }

  loginWithGoogle() {
    console.log('account service .. Login with google..')
    //TODO : Need to implement this
  }

  logout() {
    LocalStorageMember.clear();
    this.afAuth.signOut();
  }


}
