import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LoadingService } from '../core/services/loading.service';
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
    private loader: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService) {

  }

  ngOnInit(): void {
    this.getProductList();
    this.getPromoValue(this.data.slot);
  }

  getProductList() {
    try {
      this.loader.show();
      if (this.data.isStampEntry) {
        this.productSubscription = this.productService.getItemsByUserID().subscribe((product) => {
          this.productList = product;
        });
      }
    } catch (error) {

    } finally {
      this.loader.hide(10);
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

  getPromoValueFromslot(slotObj: any) {
    //TODO : have to change this logic slotObj.indexOf('{')
    if (slotObj && slotObj.indexOf('{') > -1) {
      let obj = JSON.parse(slotObj);
      return obj['title'];
    }
    else if (typeof (slotObj) == 'string') {
      return slotObj;
    }
    return "";
  }

  getPromoValueFromClaimed(claimedObj: any) {
    if (typeof (claimedObj) != 'string') {
      return claimedObj['title']
    }

    return "";
  }

  ngOnDestroy(): void {
    if (this.productSubscription)
      this.productSubscription.unsubscribe();
  }

}
