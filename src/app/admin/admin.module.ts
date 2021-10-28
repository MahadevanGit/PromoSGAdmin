//import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { SharedModule } from '../shared/shared.module';

import { AuthGuard } from '../shared/services/auth-guard.service';
import { AdminSettingComponent } from './components/admin-setting/admin-setting.component';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
//import { PromosgMaterialModule } from '../shared/material/promosg-material/promosg-material.module';
import { ShopUserFormComponent } from './components/user-setting/shop-user-form/shop-user-form.component';
import { ShopUserOutletFormComponent } from './components/user-setting/shop-user-outlet-form/shop-user-outlet-form.component';
@NgModule({
  declarations: [
    UserSettingComponent,
    AdminSettingComponent,
    ShopUserFormComponent,
    ShopUserOutletFormComponent,
  
  ],
  imports: [
    // CommonModule,
    // PromosgMaterialModule,
    SharedModule,
    RouterModule.forChild([
      {path: 'usersetting', component: UserSettingComponent, canActivate: [AuthGuard]},
      {path: 'adminsetting', component: AdminSettingComponent, canActivate: [AuthGuard, AdminAuthGuard]}
    ]),
  ]
})
export class AdminModule { }
