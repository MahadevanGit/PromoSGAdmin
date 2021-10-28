import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { LocalStorageMember } from 'src/app/shared/models/common';

@Component({
  selector: 'promoSg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    constructor(
        private auth: AuthService,
        private router: Router){}

    error: string;
    localStorageMember = new LocalStorageMember();

    async login(userData) {

          let resp;
          let returnUrl;
           try {
            await this.auth.loginUser(userData).then(x=> resp = x );
    
            if(resp && resp.success){
              returnUrl = this.localStorageMember.get(this.localStorageMember.returnUrl);
              this.router.navigate([returnUrl]);
            }
    
             this.error = resp.message;
             
           } catch (e) {
              //TODO: Need to check .. Currently could not catch exception
           }
      }

    async LoginWithGoogle(){
      console.log('Login with google called...');
       //TODO: Need to implement this
    }
  
  
  
}
