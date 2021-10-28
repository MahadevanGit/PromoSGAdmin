import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../admin/services/admin-auth-guard.service';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

import { PromosgMaterialModule } from '../shared/material/promosg-material/promosg-material.module';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { ClientAuthGuard } from '../shared/services/client-auth-guard.service';
import { PromoCardDashboardComponent } from './components/promo-card-dashboard/promo-card-dashboard.component';
import { PromoCardFormComponent } from './components/promo-card-form/promo-card-form.component';
import { PromoCardComponent } from './components/promo-card/promo-card.component';
import { PromoCardService } from './services/promo-card.service';

@NgModule({
  declarations: [
    PromoCardDashboardComponent,
    PromoCardComponent,
    PromoCardFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PromosgMaterialModule,
    RouterModule.forChild([
      {path:"promocarddb/:userId",component:PromoCardDashboardComponent,canActivate: [AuthGuard,AdminAuthGuard]},
      {path:"promocarddb",component:PromoCardDashboardComponent,canActivate: [AuthGuard,ClientAuthGuard]},
      {path:"promocarddb/assignpromocard/:customerId",component:PromoCardDashboardComponent,canActivate: [AuthGuard,ClientAuthGuard]},
      {path:"promocarddb/stamppromocard/:customerId",component:PromoCardDashboardComponent,canActivate: [AuthGuard,ClientAuthGuard]},
      
      {path:"promocard/new", component:PromoCardFormComponent,canActivate: [AuthGuard,ClientAuthGuard]},
      {path:"promocard/:key", component:PromoCardFormComponent,canActivate: [AuthGuard,ClientAuthGuard]},
      {path:"promocard/:userId/:key",component:PromoCardFormComponent,canActivate: [AuthGuard,AdminAuthGuard]}

    ]),
  ],
  providers: [
    PromoCardService,
  ],
})
export class PromoModule { }
