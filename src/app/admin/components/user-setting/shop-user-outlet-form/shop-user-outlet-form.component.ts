import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppUser } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ShopUserService } from 'src/app/shop.service';

@Component({
  selector: 'app-shop-user-outlet-form',
  templateUrl: './shop-user-outlet-form.component.html',
  styleUrls: ['./shop-user-outlet-form.component.scss']
})
export class ShopUserOutletFormComponent implements OnInit {

  error: string;
  appUser: AppUser;
  authSubscription: Subscription;
  outletList: any[];
  addressTitle: string = "Add outlet details"

  constructor(private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private shopUserService: ShopUserService) {
      this.authSubscription = this.auth.appUser$.take(1).subscribe((user)=>{
        this.appUser = user;
        this.outletList = this.appUser['outletList']; //initial load
      })
   }

   outletForm = this.fb.group({
    address: this.fb.group({
      block: ['',Validators.compose([Validators.required,Validators.minLength(1)])],
      level: [''],
      unit: [''],
      street: ['',Validators.compose([Validators.required,Validators.minLength(2)])],
      city: ['',Validators.compose([Validators.required,Validators.minLength(2)])],
      zip: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.pattern("^[0-9]*$")])]
    })
  });

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(event?){
    this.outletList = this.appUser && this.appUser['outletList'];
    const filterValue = event ? (event.target as HTMLInputElement).value : "";
    this.outletList = this.outletList && this.outletList.filter(outlet=>{
      return outlet.address.street.trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase())
            || outlet.address.zip.trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase());
    });
  }

  // async onSubmit() {
    
  //   let outletData = this.outletForm.value;
  //   var outletList = [];
  //   if (this.appUser['outletList'])  
  //   outletList = this.appUser['outletList'];
  //   outletList.push(outletData)

  //   this.appUser['outletList'] = outletList ;

  //   try {
  //     this.shopUserService.updateByObject(this.appUser.userId,this.appUser); //un-comment if u want to save 
  //     this.router.navigate(['/usersetting']);
  //     //Show flash message .. successfully updated..
  //    } catch (e) {
  //       //TODO: Need to check .. Currently could not catch exception
  //    }

  //   this.outletForm.reset();
  // }

  async onSubmit() {
      let outletData = this.outletForm.value;
      var outletList = [];
      if (this.appUser['outletList'])  
      outletList = this.appUser['outletList'];
      outletList.push(outletData)
      this.updateOutletList(outletList);
      this.outletForm.reset();
    }

  updateOutletList(outletList?: any[]){
    this.appUser['outletList'] = outletList ;
    try {
      this.shopUserService.updateByObject(this.appUser.userId,this.appUser); //un-comment if u want to save 
      this.router.navigate(['/usersetting']);
      //Show flash message .. successfully updated..
     } catch (e) {
        //TODO: Need to check .. Currently could not catch exception
     }
  }

  removeOutlet(outlet){
    this.outletList.splice(this.outletList.findIndex(item => JSON.stringify(item) === JSON.stringify(outlet)),1);
    this.updateOutletList(this.outletList);
  }

  
}
