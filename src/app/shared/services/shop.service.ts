import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import { LocalStorageMember, Result } from 'src/app/shared/models/common';
import { ShopUser } from '../models/shop';

@Injectable({
  providedIn: 'root'
})
export class ShopUserService {

  result: Result;
  localStorageMember = new LocalStorageMember();

  subscription: Subscription;

  constructor(private db: AngularFireDatabase) { }


  async save(Shop: ShopUser) {
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

  async update(shopId: string, Shop: any): Promise<Result> {
    var tryerror;
    console.log(Shop)
    try {
      this.db.object('/shops/' + shopId).update({
        userId: shopId,
        shopname: Shop['shopName'],
        firstname: Shop['firstName'],
        lastname: Shop['lastName'],
        email: Shop['email'],
        telephone: Shop['telephone'],
        shopLogo: Shop['shopLogo'],
        shopPicture: Shop['shopPicture'],
        fax: Shop['fax'],
        hotline: Shop['hotline'],
        aboutShop: Shop['aboutShop'],
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
      if (!tryerror) {
        this.result = { message: "User details updated successfully.", success: true };
        return this.result;
      }
      else {
        console.log("Notifi: Error occured when update user details.")
        this.result = { message: "Error occured when update user details. Please contact admin with this details : " + "PromoSG(shop.service.ts) : " + tryerror, success: false };
        return this.result;
      }
      //LocalStorageMember.clear();
    }

  }

  async updateByObject(shopId: string, Shop: any) {
    var tryerror;
    try {
      this.db.object('/shops/' + shopId).update(Shop);
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

  getShopUserById(shopId: string): Observable<ShopUser> {

    // let obj = this.db.object('/users/' + userId).valueChanges().map(
    //   (value) => { 
    //     let val = value ? new AppUser(value['userId'],value['firstname'],value['lastname'],value['email'],value['registeredAt'],value['isAdmin']) : null;
    //     return val;
    //   }
    // );

    // return this.db.object('/shops/' + userId).valueChanges();

    return this.db.object<ShopUser>('/shops/' + shopId).valueChanges();
    
  }

  getAllShopUser(): Observable<ShopUser[]> {
    return this.db.object<ShopUser[]>('/shops').valueChanges();;
  }

  // ngOnDestroy(): void {
  //   console.log('shop.service.ts : ngOnDestroy called..')
  //   //this.subscription.unsubscribe();
  // }
}

