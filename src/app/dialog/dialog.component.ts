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
    private productService: ProductService) 
    {
      if(data.isStampEntry){
        this.productSubscription = this.productService.getItemsByUserID().subscribe((product)=> { 
        this.productList =   product ;
        });
      }
  }

  ngOnInit(): void {
    this.getPromoValue(this.data.slot);
  }

  checkCategory(value){
    this.errorMessage = "Enter the category name.";
    if(value){
      let re = / /gi; 
      let _value = value.replace(re,"").toLocaleLowerCase();
      this.errorMessage = "";
      this.data.slot.existingData.forEach(element => {
        let cat_name = element.value.replace(re,"").toLocaleLowerCase();
        if(cat_name == _value){
          this.errorMessage = "Category already exist.";
          return;
        }
      });
    }

    if(this.errorMessage){
      this.canAdd = true;
    }
    else{
      this.canAdd = false;
    }
  }

  onCheckCategory(category){
    this.data.slot.existingData.forEach(element => {
      if(element.key == category.key){
        element.active = category.active;
      }
    });
  }

  getPromoValue(slot: any){
    this.promoSlot = (slot.key.indexOf('Taken_Promo_')>-1) ? JSON.parse(slot.value.value) : slot.value;
  }

  getPromoValueFromslot(slotObj: any){
    //TODO : have to change this logic slotObj.indexOf('{')
    if(slotObj && slotObj.indexOf('{') > -1 ){
      let obj = JSON.parse(slotObj);
    return obj['title'];
  }
  else if(typeof(slotObj) == 'string'){
    return slotObj;
  }
  return "";  
  }

  getPromoValueFromClaimed(claimedObj: any){
    if (typeof(claimedObj) != 'string') 
    {
      return claimedObj['title']
    }
      
    return "";  
  }

  ngOnDestroy(): void {
    if(this.productSubscription)
      this.productSubscription.unsubscribe();
  }

}
