import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProductService } from '../product/services/product.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  providers: [ProductService]
})
export class DialogComponent implements OnInit, OnDestroy {

  canAdd: boolean = true;
  errorMessage: string;
  promoSlot: string;
  productList: any;
  productSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService) {

  }

  ngOnInit(): void {
    this.getProductList();
    this.getPromoValue(this.data.slot);
  }

  getProductList() {
    try {
      if (this.data.isStampEntry) {
        this.productSubscription = this.productService.getItemsByUserID().subscribe((product) => {
          this.productList = product;
        });
      }
    } catch (error) {
    } finally {
    }
  }

  checkCategory(value) {
    this.errorMessage = "Enter the category name.";
    if (value) {
      let re = / /gi;
      let _value = value.replace(re, "").toLocaleLowerCase();
      this.errorMessage = "";
      this.data.slot.existingData.forEach(element => {
        let cat_name = element.value.replace(re, "").toLocaleLowerCase();
        if (cat_name == _value) {
          this.errorMessage = "Category already exist.";
          return;
        }
      });
    }

    if (this.errorMessage) {
      this.canAdd = true;
    }
    else {
      this.canAdd = false;
    }
  }

  onCheckCategory(category) {
    this.data.slot.existingData.forEach(element => {
      if (element.key == category.key) {
        element.active = category.active;
      }
    });
  }

  getPromoValue(slot: any) {
    if (slot)
      this.promoSlot = ((slot.key && slot.key.indexOf('Taken_Promo_')) > -1) ? JSON.parse(slot.value.value) : slot.value;
    else
      this.promoSlot = "TODO ";
  }

  sendData(data: any) {
    return JSON.stringify(data.slot);
  }

  getPromoValueFromslot(slotObj: any) {
    //TODO : have to change this logic slotObj.indexOf('{')
    if (slotObj && slotObj.indexOf('{') > -1) {
      let obj = JSON.parse(slotObj);
      //TODO : purchased product storing data structure modified on 25-08-2024
      //Delete all the data from firebase and keep only 
      //return obj['purchased']['title'];
      return obj['purchased'] ? obj['purchased']['title'] : obj['title'];
    }
    else if (typeof (slotObj) == 'string') {
      return slotObj;
    }
    return "";
  }

  getPromoValueFromClaimed(promoSlot: any) {
    //TODO : purchased product storing data structure modified on 25-08-2024
      //Delete all the data from firebase and keep only 
      //return obj['purchased']['title'];
    if (typeof (promoSlot) != 'string' && promoSlot['purchased']) {
      let title = promoSlot['purchased']['purchased']['title']
      return title
    } else if (typeof (promoSlot) != 'string' && promoSlot['claimed']) {
      let title = promoSlot['claimed']['title']
      return title
    }
    return "";
  }

  ngOnDestroy(): void {
    if (this.productSubscription)
      this.productSubscription.unsubscribe();
  }
}
