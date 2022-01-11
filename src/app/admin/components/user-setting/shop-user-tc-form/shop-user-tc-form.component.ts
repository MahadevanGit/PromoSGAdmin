import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ShopUser, Tc, TermsAndCondition } from 'src/app/shared/models/shop';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ShopUserService } from 'src/app/shared/services/shop.service';

@Component({
  selector: 'shop-user-tc-form',
  templateUrl: './shop-user-tc-form.component.html',
  styleUrls: ['./shop-user-tc-form.component.scss']
})
export class ShopUserTcFormComponent implements OnInit {

  @Input("shopUser") shopUser: ShopUser;

  error: string;
  appUser: ShopUser;
  tcList: TermsAndCondition[];
  tcTitle: string = "Add terms & condition details"

  constructor(private loader: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private shopUserService: ShopUserService) { }

  tcForm = this.fb.group({
    tc: this.fb.group({
      text: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      isActive: [false]
    })
  });

  ngOnInit(): void {
    this.appUser = this.shopUser;
    this.tcList = this.appUser.termsAndCondition; //initial load
    this.applyFilter();
  }

  applyFilter(event?) {
    this.tcList = this.appUser && this.appUser.termsAndCondition;
    const filterValue = event ? (event.target as HTMLInputElement).value : "";
    this.tcList = this.tcList && this.tcList.filter(tc => {
      return tc.tc.text.trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase());
    });
  }

  async onSubmit() {
    let tcData = this.tcForm.value as TermsAndCondition;
    this.tcList = [];
    if (this.appUser.termsAndCondition)
      this.tcList = this.appUser.termsAndCondition;
    tcData.tc.modifiedAt = new Date(Date.now()).toLocaleString("en-us");
    tcData.tc.modifiedBy = this.appUser.userId;
    this.tcList.push(tcData)
    this.updateTcList(this.tcList);
    this.tcForm.reset();
    this.applyFilter();
  }

  updateTcList(tcList?: any[]) {
    this.loader.show();
    this.appUser.termsAndCondition = tcList;
    try {
      this.shopUserService.updateByObject(this.appUser.userId, this.appUser); //un-comment if u want to save 
      this.router.navigate(['/usersetting']);
      //Show flash message .. successfully updated..
    } catch (e) {
      //TODO: Need to check .. Currently could not catch exception
    } finally {
      this.loader.hide();
    }
  }

  onCheck(tc: Tc){
    console.log(tc);
  }

  removeTc(tc) {
    this.tcList.splice(this.tcList.findIndex(item => JSON.stringify(item) === JSON.stringify(tc)), 1);
    this.updateTcList(this.tcList);
  }
}
