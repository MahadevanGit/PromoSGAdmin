import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})

export class ImagesComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  auth_subscription: Subscription;
  userId: string;

  constructor(private auth: AuthService) { 
    this.auth_subscription = this.auth.appUser$.subscribe(_user=> { 
      this.isAdmin = _user.isAdmin;
      this.userId = _user.userId; 
    });
  }
 

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.auth_subscription.unsubscribe();
  }

}
