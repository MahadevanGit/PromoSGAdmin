import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalStorageMember } from '../models/common';
import { IPromotionCard } from '../../promo/models/promotioncard';

@Injectable({
  providedIn: 'root'
})
export class UserContentService {

  localStorageMember = new LocalStorageMember();
  itemsRef: AngularFireList<any>;
  itemsObjRef: AngularFireObject<any>;
  items: Observable<any[]>;
  subscription: Subscription;
  orderBy: string = 'modifiedDate';
  usersUserContent: string = 'users-user-content';
  userPromocards: string = 'user-promocards'
  shopUserId: string;
  pathRef: string = '';
  customerId: string;

  constructor(private db: AngularFireDatabase,
    private route: ActivatedRoute) {
    this.shopUserId = LocalStorageMember.get(LocalStorageMember.userId);
  }

  addItem(promoCard: IPromotionCard) {
    this.db.object(this.pathRef + promoCard.key).set(promoCard);
  }

  updateItem(promoCard: IPromotionCard) {
    try {
      this.db.object(this.pathRef + promoCard.key).update(promoCard);
    } catch (error) {
      console.log(error)
    }
  }

  getItem(key: string, userId?: string) {
    //return this.db.object<IPromotionCard>('/shop-user-content/' + (userId ? userId : this.userId) + '/promocards/' + key);
  }

  getItems() {
    return this.itemsRef;
  }

  getItemsByCustomerId(_customerId: string) {
    this.pathRef = '/' + this.usersUserContent + '/' + _customerId + '/' + this.userPromocards + '/' + this.shopUserId + '/';
    this.itemsRef = this.db.list(this.pathRef, ref => {
      return ref.orderByChild(this.orderBy)
    });
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.items;
  }

}

