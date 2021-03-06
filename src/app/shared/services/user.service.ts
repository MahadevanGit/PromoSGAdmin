import 'rxjs/add/operator/map';

import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import { LocalStorageMember } from 'src/app/shared/models/common';
import { map } from 'rxjs/operators';
import { User } from '../models/user'



@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  localStorageMember = new LocalStorageMember();
  subscription: Subscription;
  userId: string;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  userPath1: string = 'users';

  constructor(private db: AngularFireDatabase) {
    this.userId = LocalStorageMember.get(LocalStorageMember.userId);

    // this.itemsRef = db.list<User>('/' + this.userPath1 + '/');
    // Use snapshotChanges().map() to store the key
    // this.items = this.itemsRef.snapshotChanges().pipe(
    //   map(changes =>
    //     changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
    //   )
    // )

  }


  // This save method handle from PromoSG mobile app
  // async save(user: any){
  //   let userId = LocalStorageMember.get(LocalStorageMember.userId);
  //   console.log('userid from user.service : ' + userId);
  //   try {
  //     this.db.object('/users/' + userId).update({
  //       userId: userId,
  //       firstname: user['firstName'],
  //       lastname: user['lastName'],
  //       email: user['email'],
  //       registeredAt: new Date(Date.now()).toLocaleString("en-us")
  //     })
  //   } catch (error) {
  //     console.log(error.message)
  //   } finally{
  //     LocalStorageMember.clear();
  //   }

  // }

  getByUserId(userId: string): Observable<User> {
    return this.db.object<User>('/' + this.userPath1 + '/' + userId).valueChanges();
  }

  getAllUser(): Observable<User[]> {
    return this.db.object<User[]>('/' + this.userPath1).valueChanges();
  }

  ngOnDestroy(): void {
    console.log('user.service.ts : ngOnDestroy called..')
    //this.subscription.unsubscribe();
  }

}

