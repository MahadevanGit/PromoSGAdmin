import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ChartsModule } from 'ng2-charts';
import { MultiSelectDdComponent } from './components/control/multi-select-dd/multi-select-dd.component';
import { MenuIconDdComponent } from './components/control/menu-icon-dd/menu-icon-dd.component';

@NgModule({
  declarations: [
    ImageUploadComponent,
    ImageGalleryListComponent,
    AddressComponent,
    StackedHorizontalBarChartComponent,
    MultiSelectDdComponent,
    MenuIconDdComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    PromosgMaterialModule,
    ReactiveFormsModule,
    FormsModule,
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
    ChartsModule,
    PromosgMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ImageUploadComponent,
    ImageGalleryListComponent,
    AddressComponent,
    StackedHorizontalBarChartComponent,
    MultiSelectDdComponent,
    MenuIconDdComponent
  ]

})
export class SharedModule { }
