import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageMember } from 'src/app/shared/models/common';

@Injectable({
  providedIn: 'root'
})

export class MasterContentService {

  localStorageMember = new LocalStorageMember();
  userId;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  subscription: Subscription;
  orderBy: string = 'value';

  constructor(private db: AngularFireDatabase) {
    this.userId = this.localStorageMember.get(this.localStorageMember.userId);
    this.itemsRef = db.list('/master-content/image-categories/', ref => {
      return ref.orderByChild(this.orderBy)
    });
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  get(userId: string): AngularFireList<any> {
    console.log('CategoryService ...')
    // return this.db.list('/shop-user-content/' + userId + '/categories/',ref => {
    //   return ref.orderByChild(this.orderBy)
    // });
    return this.itemsRef;
  }

  getItemsWithMap() {
    this.itemsRef = this.db.list('/master-content/image-categories/', ref => {
      return ref.orderByChild(this.orderBy)
    });
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.items;
  }

  addItem(imagecategory: any) {
    this.itemsRef.push(imagecategory);
  }
  updateItem(key: string, imagecategory: any) {
    this.itemsRef.update(key, imagecategory);
  }
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }
  getItemByKey(key: string) {
    return this.db.object('/master-content/image-categories/' + key);
  }
  getItems() {
    return this.itemsRef;
  }
}
