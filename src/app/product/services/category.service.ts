import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageMember } from 'src/app/shared/models/common';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

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
    //     changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
    //   )
    // );
   }

  // get(userId: string): AngularFireList<any>  {
  //   console.log('CategoryService ...')
  // // return this.db.list('/shop-user-content/' + userId + '/categories/',ref => {
  // //   return ref.orderByChild(this.orderBy)
  // // });
  // return this.itemsRef;
  // }

  getItemsWithMap(_userId: string){
    this.itemsRef = this.db.list('/shop-user-content/' + _userId + '/categories/',ref => {
      return ref.orderByChild(this.orderBy)
    });
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.items;
  }

  addItem(category: any) {
    this.itemsRef = this.db.list('/shop-user-content/' + this.userId + '/categories/',ref => {
      return ref.orderByChild(this.orderBy)
    });
    this.itemsRef.push(category);
  }
  updateItem(key: string, category: any) {
    this.itemsRef = this.db.list('/shop-user-content/' + this.userId + '/categories/',ref => {
      return ref.orderByChild(this.orderBy)
    });
    this.itemsRef.update(key, category);
  }
  // deleteItem(key: string) {
  //   this.itemsRef.remove(key);
  // }
  // deleteEverything() {
  //   this.itemsRef.remove();
  // }
  // getItem(key: string){
  //   return this.db.object('/shop-user-content/' + this.userId + '/categories/' + key);
  // }
  getItems(){
    this.itemsRef = this.db.list('/shop-user-content/' + this.userId + '/categories/',ref => {
      return ref.orderByChild(this.orderBy)
    });
    return this.itemsRef;
  }
  getItemsByUserID(_userId: string){
    this.itemsRef = this.db.list('/shop-user-content/' + _userId + '/categories/',ref => {
      return ref.orderByChild(this.orderBy)
    });
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );

    return this.items;
  }

}
