import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../admin/services/admin-auth-guard.service';
import { PromosgMaterialModule } from '../shared/material/promosg-material/promosg-material.module';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { ClientAuthGuard } from '../shared/services/client-auth-guard.service';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductComponent } from './components/products/product.component';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { ProductStatsService } from './services/product.stats.service';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PromosgMaterialModule,
    RouterModule.forChild([
      { path: "product/new", component: ProductFormComponent, canActivate: [AuthGuard, ClientAuthGuard] },
      { path: "product/:id", component: ProductFormComponent, canActivate: [AuthGuard, ClientAuthGuard] },
      { path: "products/:userId", component: ProductComponent, canActivate: [AuthGuard, AdminAuthGuard] },
      { path: "products", component: ProductComponent, canActivate: [AuthGuard, ClientAuthGuard] }
    ])
  ],
  providers: [
    ProductService,
    CategoryService,
    ProductStatsService,
  ],
})
export class ProductModule { }
