//import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { AdminSettingComponent } from './components/admin-setting/admin-setting.component';
import { ShopUserFormComponent } from './components/user-setting/shop-user-form/shop-user-form.component';
import { ShopUserOutletFormComponent } from './components/user-setting/shop-user-outlet-form/shop-user-outlet-form.component';
import { ShopUserTcFormComponent } from './components/user-setting/shop-user-tc-form/shop-user-tc-form.component';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
import { AdminAuthGuard } from './services/admin-auth-guard.service';

@NgModule({
  declarations: [
    UserSettingComponent,
    AdminSettingComponent,
    ShopUserFormComponent,
    ShopUserOutletFormComponent,
    ShopUserTcFormComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'usersetting', component: UserSettingComponent, canActivate: [AuthGuard] },
      { path: 'adminsetting', component: AdminSettingComponent, canActivate: [AuthGuard, AdminAuthGuard] }
    ]),
  ]
})
export class AdminModule { }
