import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { LocalStorageMember } from '../../shared/models/common';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators/map';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  localStorageMember = new LocalStorageMember();
  userId;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  subscription: Subscription;

  constructor(private db: AngularFireDatabase) {
    this.userId = this.localStorageMember.get(this.localStorageMember.userId);
    this.itemsRef = db.list('/shop-user-content/' + this.userId + '/products/');
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
   }
   
  addItem(product: any) {
    this.itemsRef.push(product);
  }
  updateItem(key: string, product: any) {
    this.itemsRef.update(key, product);
  }
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }
  getItem(key: string){
    return this.db.object('/shop-user-content/' + this.userId + '/products/' + key);
  }
  getItems(){
    return this.itemsRef;
  }
  getItemsByUserID(_userId: string){
    this.itemsRef = this.db.list('/shop-user-content/' + _userId + '/products/');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

    return this.items;
  }

}
