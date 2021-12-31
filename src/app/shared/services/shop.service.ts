import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import { LocalStorageMember } from 'src/app/shared/models/common';
import { Shop } from '../models/shop';

@Injectable({
  providedIn: 'root'
})
export class ShopUserService {

  currentUser: Shop;
  localStorageMember = new LocalStorageMember();

  subscription: Subscription;

  constructor(private db: AngularFireDatabase) { }


  async save(Shop: any) {
    let userId = LocalStorageMember.get(LocalStorageMember.userId);
    console.log('userid from shop.service : ' + userId);
    try {
      this.db.object('/shops/' + userId).update({
        userId: userId,
        shopname: Shop['shopName'],
        firstname: Shop['firstName'],
        lastname: Shop['lastName'],
        email: Shop['email'],
        registeredAt: new Date(Date.now()).toLocaleString("en-us")
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      //LocalStorageMember.clear();
    }

  }

  async update(userId: string, Shop: any) {
    var tryerror;
    try {
      this.db.object('/shops/' + userId).update({
        userId: userId,
        shopname: Shop['shopName'],
        firstname: Shop['firstName'],
        lastname: Shop['lastName'],
        email: Shop['email'],
        telephone: Shop['telephone'],
        shopLogo: Shop['shopLogo'],
        shopPicture: Shop['shopPicture'],
        fax: Shop['fax'],
        hotline: Shop['hotline'],
        address: Shop['address'],
        weblink: Shop['weblink'],
        outletList: Shop['outletList'],
        registeredAt: Shop['registeredAt'],
        modifiedAt: new Date(Date.now()).toLocaleString("en-us")
      });
    } catch (error) {
      console.log(error.message)
      tryerror = error;
    } finally {
      if (!tryerror)
        console.log("Notifi: User details updated successfully.")
      else
        console.log("Notifi: Error occured when update user details.")
      //LocalStorageMember.clear();
    }

  }

  async updateByObject(userId: string, Shop: any) {
    var tryerror;
    try {
      this.db.object('/shops/' + userId).update(Shop);
    } catch (error) {
      console.log(error.message)
      tryerror = error;
    } finally {
      if (!tryerror)
        console.log("Notifi: User details updated successfully.")
      else
        console.log("Notifi: Error occured when update user details.")
      //LocalStorageMember.clear();
    }

  }

  get(userId: string): Observable<any> {

    // let obj = this.db.object('/users/' + userId).valueChanges().map(
    //   (value) => { 
    //     let val = value ? new AppUser(value['userId'],value['firstname'],value['lastname'],value['email'],value['registeredAt'],value['isAdmin']) : null;
    //     return val;
    //   }
    // );

    return this.db.object('/shops/' + userId).valueChanges();
  }

  getAllUser(): Observable<any> {
    return this.db.object('/shops').valueChanges();;
  }

  // ngOnDestroy(): void {
  //   console.log('shop.service.ts : ngOnDestroy called..')
  //   //this.subscription.unsubscribe();
  // }
}

