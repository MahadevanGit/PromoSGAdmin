import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LocalStorageMember } from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageDetailList: AngularFireList<any>;
  userId: string;
  //auth_subscription: Subscription;
  //isAdmin: boolean;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  orderBy: string = '';

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService) {
    // this.auth_subscription = this.auth.appUser$.subscribe(_user=> { 
    //   this.isAdmin = _user.isAdmin;
    //   this.userId = _user.userId; 
    //   this.imageDetailList =  this.db.list(`shop-user-content/${this.userId}/product-imageDetails/`);
    // });
    this.userId = LocalStorageMember.get(LocalStorageMember.userId);
    this.itemsRef = db.list('/shop-user-content/' + this.userId + '/product-imageDetails/', ref => {
      return ref;
    });
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  insertImageDetails(rootPath, imageDetails) {
    this.imageDetailList = this.db.list(rootPath);
    this.imageDetailList.push(imageDetails);
  }

  getAll(_foldername: string, _userId?: string, ) {
    this.itemsRef = this.db.list('/shop-user-content/' + (_userId ? _userId : this.userId) + _foldername, ref => {
      return ref;
    });
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ ...c.payload.val() }))
      )
    );
    return this.items;
  }

  getImageListByCategory(_categoryKey: string,_imageFolderName: string,_userId?: string) {
    if (!_categoryKey)
      return Observable.of(null);
    var path = '/shop-user-content/' + (_userId ? _userId : this.userId) + '/' + _imageFolderName + '/' + _categoryKey + '/' ;
    this.itemsRef = this.db.list(path, ref => {
      return ref;
    });
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ ...c.payload.val() }))
      )
    );
    return this.items;
  }

}
