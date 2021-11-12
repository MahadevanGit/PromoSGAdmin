import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsDbdComponent } from '../statistics/components/statistics-dbd/statistics-dbd.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { AdminAuthGuard } from '../admin/services/admin-auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { ProductStatsComponent } from './components/product-stats/product-stats.component';

@NgModule({
  declarations: [
    StatisticsDbdComponent,
    ProductStatsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: 'statisticsdbd', component: StatisticsDbdComponent,canActivate: [AuthGuard] },
      {path: 'statisticsdbd/:userId', component: StatisticsDbdComponent,canActivate:[AuthGuard,AdminAuthGuard]},
    ])
  ],
  providers:[
  ],
  exports:[
  ]
})
export class StatisticsModule {
 }
