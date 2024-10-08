import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { LocalStorageMember } from '../../shared/models/common';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/app/shared/models/product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  localStorageMember = new LocalStorageMember();
  userId;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  subscription: Subscription;
  orderBy: string = 'value';

  constructor(private db: AngularFireDatabase) {
    this.userId = LocalStorageMember.get(LocalStorageMember.userId);

    // Use snapshotChanges().map() to store the key
    // this.items = this.itemsRef.snapshotChanges().pipe(
    //   map(changes => 
    //     changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
    //   )
    // );
  }

  addItem(product: IProduct) {
    this.itemsRef = this.db.list('/shop-user-content/' + this.userId + '/products/');
    this.itemsRef.push(product).then(ref => {
      // after add a new item, then take the firebase object reference key and 
      // update the product with the key immediately
      product.key = ref.key;
      this.updateItem(ref.key,product);
    });
  }
  updateItem(key: string, product: IProduct) {
    this.itemsRef = this.db.list('/shop-user-content/' + this.userId + '/products/');
    this.itemsRef.update(key, product);
  }
  deleteItem(key: string) {
    this.itemsRef = this.db.list('/shop-user-content/' + this.userId + '/products/');
    this.itemsRef.remove(key);
  }
  // deleteEverything() {
  //   this.itemsRef.remove();
  // }
  getItem(key: string){
    return this.db.object('/shop-user-content/' + this.userId + '/products/' + key);
  }
  // getItems(){
  //   return this.itemsRef;
  // }
  getItemsByUserID(_userId?: string) {
    _userId = _userId ? _userId : this.userId;
    this.itemsRef = this.db.list('/shop-user-content/' + _userId + '/products/');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.items;
  }

}
