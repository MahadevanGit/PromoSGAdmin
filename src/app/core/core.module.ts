import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { PromosgMaterialModule } from '../shared/material/promosg-material/promosg-material.module';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { BsNavbarComponent } from './components/bs-navbar/bs-navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MenuLeftComponent } from './components/menu-left/menu-left.component';
import { NavbarHeaderComponent } from './components/navbar-header/navbar-header.component';
import { RegisterComponent } from './components/register/register.component';
import { SidenavService } from './services/sidenav.service';

@NgModule({
  declarations: [
    BsNavbarComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    MenuLeftComponent,
    NavbarHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PromosgMaterialModule,
    BrowserAnimationsModule,
    RouterModule.forChild([
      {path: '', component: DashboardComponent,canActivate: [AuthGuard] },
      {path: 'login', component: LoginComponent },
      {path: 'register', component: RegisterComponent },
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]}
    ])
  ],
  exports:[
    BsNavbarComponent,
    MenuLeftComponent,
    NavbarHeaderComponent
  ],
  providers:[
    SidenavService
  ]
})
export class CoreModule { }
