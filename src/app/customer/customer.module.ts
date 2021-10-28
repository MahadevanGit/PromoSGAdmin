import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../admin/services/admin-auth-guard.service';
import { PromosgMaterialModule } from '../shared/material/promosg-material/promosg-material.module';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { CustomerComponent } from './components/customer/customer.component';
import { ShopCustomerService } from './services/customer.service';

@NgModule({
    declarations: [
        CustomerComponent
    ],
    imports: [
      CommonModule,
      PromosgMaterialModule,
      RouterModule.forChild([
        {path: 'customers', component: CustomerComponent, canActivate: [AuthGuard]},
        {path:"customers/:userId",component:CustomerComponent,canActivate: [AuthGuard,AdminAuthGuard]},
      ])
    ],
    providers: [
        ShopCustomerService
    ],
  })
  export class CustomerModule { }