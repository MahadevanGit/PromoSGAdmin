import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';
import { environment } from 'src/environments/environment';

import { AdminModule } from './admin/admin.module';
import { AdminAuthGuard } from './admin/services/admin-auth-guard.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/components/login/login.component';
import { CoreModule } from './core/core.module';
import { DialogComponent } from './dialog/dialog.component';
import { ProductFormComponent } from './product/components/product-form/product-form.component';
import { ProductComponent } from './product/components/products/product.component';
import { ProductModule } from './product/product.module';
import { PromoModule } from './promo/promo.module';
import { CustomerModule } from './customer/customer.module';
import { AuthGuard } from './shared/services/auth-guard.service';
import { SharedModule } from './shared/shared.module';
import { UserService } from './user.service';
import { ShopUserService } from './shop.service';
import { ShopCustomerService } from './customer/services/customer.service';
import { UserContentService } from './user-content.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ClientAuthGuard } from './shared/services/client-auth-guard.service';
import { StatisticsModule } from './statistics/statistics.module';
import { LoadingService } from './loading.service';
@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ProductFormComponent,
    DialogComponent,
    PageNotFoundComponent
    ],
  entryComponents:[DialogComponent],
  imports: [
    BrowserModule,
    NgbModule,
    CustomFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    ReactiveFormsModule, // This module for Reactive form
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AdminModule,
    ProductModule,
    PromoModule,
    StatisticsModule,
    CustomerModule,
    CommonModule,
    FormsModule, // This module for template driven form //TODO: create common module and assign to all the component from common module
    RouterModule.forRoot([
      {path: '**', component:PageNotFoundComponent}
     ]),
  ],
exports:[
],
  providers: [
    AuthGuard,
    AdminAuthGuard,
    UserService,
    ShopUserService,
    ShopCustomerService,
    UserContentService,
    LoadingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
