import 'rxjs/add/operator/map';

import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';

import { User } from '../../shared/models/user';
import { LocalStorageMember } from '../../shared/models/common';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ShopCustomerService implements OnDestroy {
  subscription: Subscription;
  localStorageMember = new LocalStorageMember();
  userId: string;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  shop_path1: string = 'shop-user-content';
  shop_path2: string = 'owned-users';

  constructor(private db: AngularFireDatabase) {
    this.userId = this.localStorageMember.get(this.localStorageMember.userId);
    let pathRef = '/' + this.shop_path1 + '/' + this.userId + '/' + this.shop_path2 + '/';
    this.itemsRef = db.list(pathRef);
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  getItemsByShopUserID(_shopUserId: string) {
    let pathRef = '/' + this.shop_path1 + '/' + _shopUserId + '/' + this.shop_path2 + '/';
    this.itemsRef = this.db.list(pathRef);
    return this.itemsRef;
  }

  ngOnDestroy(): void {
    console.log('user.service.ts : ngOnDestroy called..')
    //this.subscription.unsubscribe();
  }

}


