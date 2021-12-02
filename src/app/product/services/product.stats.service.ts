import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { LocalStorageMember } from '../../shared/models/common';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductStats } from 'src/app/shared/models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductStatsService {

  localStorageMember = new LocalStorageMember();
  shop_userId;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  subscription: Subscription;
  orderBy: string = 'value';
  shopUserContent: string = '/shop-user-content/';
  productStats: string = '/products-stats/';
  productKey: string = '';
  customerKey: string = '';
  pathRef: string ='';

  constructor(private db: AngularFireDatabase) {
    this.shop_userId = this.localStorageMember.get(this.localStorageMember.userId);
   }
   
  addItem(productStatsObj: ProductStats) {
    this.pathRef = this.shopUserContent + this.shop_userId + this.productStats;

    let finalRef = this.pathRef + productStatsObj['productKey'] + '/' + productStatsObj['customerKey']  + '/' ;

    this.itemsRef = this.db.list(finalRef);

    this.itemsRef.push(productStatsObj);  
  }
  
  updateItem(key: string, productStatsObj: any) {
    this.itemsRef = this.db.list(this.shopUserContent + this.shop_userId + this.productStats);
    this.itemsRef.update(key, productStatsObj);
  }

  deleteItem(key: string) {
    this.itemsRef = this.db.list(this.shopUserContent + this.shop_userId + this.productStats);
    this.itemsRef.remove(key);
  }
  // deleteEverything() {
  //   this.itemsRef.remove();
  // }
  getItem(key: string){
    return this.db.object(this.shopUserContent + this.shop_userId + this.productStats + key);
  }
 
   /**
  * @param _shop_userId pass shop user id if promo sg admin user otherwise ignore
  * @returns product stats object by shop user id
  */
  getItemsByUserID(_shop_userId?: string){
    _shop_userId = _shop_userId ? _shop_userId : this.shop_userId;
    this.itemsRef = this.db.list(this.shopUserContent + this.shop_userId + this.productStats);
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.items;
  }

}
