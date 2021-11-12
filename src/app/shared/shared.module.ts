import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { RouterModule } from '@angular/router';

import { PromosgMaterialModule } from './material/promosg-material/promosg-material.module';
import { AuthService } from './services/auth.service';
import { ClientAuthGuard } from './services/client-auth-guard.service';
import { ImageService } from './services/image.service';
import { MasterContentService } from './services/master-content.service'
import { AuthGuard } from './services/auth-guard.service';
import { AdminAuthGuard } from '../admin/services/admin-auth-guard.service';
import { ImageGalleryListComponent } from './components/image-gallery-list/image-gallery-list.component';
import { AddressComponent } from './components/address/address.component';
import { StackedHorizontalBarChartComponent } from './components/charts/stacked-horizontal-bar-chart/stacked-horizontal-bar-chart.component';

@NgModule({
  declarations: [
    ImageUploadComponent,
    ImageGalleryListComponent,
    AddressComponent,
    StackedHorizontalBarChartComponent
  ],
  imports: [
    CommonModule,
    PromosgMaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {path:"image-upload",component:ImageUploadComponent,canActivate: [AuthGuard]},
    ]),
  ],
  providers:[
    AuthService,
    ClientAuthGuard,
    ImageService,
    MasterContentService,
  ],
  exports:[
    CommonModule,
    PromosgMaterialModule,
    ReactiveFormsModule,
    ImageUploadComponent,
    ImageGalleryListComponent,
    AddressComponent,
    StackedHorizontalBarChartComponent
  ]

})
export class SharedModule { }
