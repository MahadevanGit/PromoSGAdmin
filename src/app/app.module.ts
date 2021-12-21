import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';
import { environment } from 'src/environments/environment';
import { AdminModule } from './admin/admin.module';
import { AdminAuthGuard } from './admin/services/admin-auth-guard.service';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CustomerModule } from './customer/customer.module';
import { ShopCustomerService } from './customer/services/customer.service';
import { DialogComponent } from './dialog/dialog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductFormComponent } from './product/components/product-form/product-form.component';
import { ProductComponent } from './product/components/products/product.component';
import { ProductModule } from './product/product.module';
import { PromoModule } from './promo/promo.module';
import { AuthGuard } from './shared/services/auth-guard.service';
import { SharedModule } from './shared/shared.module';
import { StatisticsModule } from './statistics/statistics.module';
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
    //BrowserAnimationsModule,
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
    ShopCustomerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
