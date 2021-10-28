import { Injectable, Query } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageMember } from '../../shared/models/common';
import { IPromotionCard } from '../models/promotioncard';

@Injectable({
  providedIn: 'root'
})
export class PromoCardService {

  localStorageMember = new LocalStorageMember();
  userId;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  subscription: Subscription;
  orderBy: string = 'modifiedDate';

  constructor(private db: AngularFireDatabase) {
    this.userId = this.localStorageMember.get(this.localStorageMember.userId);
    this.itemsRef = db.list('/shop-user-content/' + this.userId + '/promocards/',ref => {
      return ref.orderByChild(this.orderBy)
    });
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
   }

  addItem(promoCard: any) {
    this.itemsRef.push(promoCard);
  }
  updateItem(key: string, promoCard: any) {
    this.itemsRef.update(key, promoCard);
  }
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }
  getItem(key: string,userId?: string){
    return this.db.object<IPromotionCard>('/shop-user-content/' + (userId ? userId : this.userId) + '/promocards/' + key);
  }
  getItems(){
    return this.itemsRef;
  }
  getItemsByUserID(_userId: string){
    this.itemsRef = this.db.list(
      '/shop-user-content/' + _userId + '/promocards/',ref => {
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

