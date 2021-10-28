import { KeyValue } from '@angular/common';
import { JsonpClientBackend } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/product/services/product.service';
import { LocalStorageMember } from 'src/app/shared/models/common';
import { UserContentService } from 'src/app/user-content.service';

import { DialogComponent } from '../../../dialog/dialog.component';
import { AuthService } from '../../../shared/services/auth.service';
import { IPromotionCard } from '../../models/promotioncard';
import { PromoCardService } from '../../services/promo-card.service';


@Component({
  selector: 'promo-card',
  templateUrl: './promo-card.component.html',
  styleUrls: ['./promo-card.component.scss'],
  providers:[PromoCardService,UserContentService,ProductService,AuthService]
})
export class PromoCardComponent implements OnChanges, OnDestroy{

  @Input('promoData') promoData: IPromotionCard;
  @Input('canEdit') canEdit: boolean;
  @Input('action') action: any;
  @Output() onAfterPromoGeneratedData = new EventEmitter<any>();
  promogeneratedData: KeyValue<string,KeyValue<string,string>>[] = [];
  gridColumn: number = 6;
  userId: string;
  isAdmin: boolean = false;
  currentDate: Date = new Date();
  subscription: Subscription;
  currentUserId: string;
  localStorage = new LocalStorageMember();

  //assign promo card to user
  customerId: string;
  assignPromoCard: any;
  userContentServiceSubscription: Subscription;
  productSubscription: Subscription;
  customerAssignedPromoCardList: IPromotionCard[] =[];
  isPromoCardAssignedToCustomer: boolean = false;
  stampPromoCard: any;
  promoSlot: any;
  productList: any[];

  constructor(
    private dialog: MatDialog,
    private promoCardService: PromoCardService,
    private userContentService: UserContentService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private auth: AuthService
    ) {
      
      //this.userId = this.route.snapshot.paramMap.get('userId');
      this.currentUserId = this.localStorage.get(this.localStorage.userId);
      this.subscription = this.auth.appUser$.subscribe(_user=>{ this.isAdmin = _user.isAdmin })
      this.promogeneratedData = this.promoData && this.promoData.promoGrid  ? this.promoData.promoGrid : [];
      //assign promo card to user
      this.assignPromoCard = this.route.snapshot.url.find(x=>x.path == 'assignpromocard');
      this.stampPromoCard = this.route.snapshot.url.find(x=>x.path == 'stamppromocard');
      this.customerId = this.route.snapshot.paramMap.get('customerId');
      this.userContentServiceSubscription = this.userContentService
      .getItemsByCustomerId(this.customerId)
      .subscribe((value)=>{
        this.customerAssignedPromoCardList = value;
        this.customerAssignedPromoCardList.forEach(element => {
          if(element.key == this.promoData.key) this.isPromoCardAssignedToCustomer =  true;
        });
      })

      

    }

  ngOnChanges(changes: SimpleChanges): void {
    this.isPromoCardAssignedToCustomer = false;
    this.customerAssignedPromoCardList.forEach(element => {
      if(element.key == changes.promoData.currentValue.key) this.isPromoCardAssignedToCustomer =  true;
    });
  }

  generatePromoData(parentPromoData) {
    let promoCardData = parentPromoData; 
    promoCardData.slots = promoCardData.slots ? promoCardData.slots : 12;
    this.promogeneratedData = [];
    let promoPoint = promoCardData.promopoint;
    let totalPromotion = parseInt((promoCardData.slots / promoPoint).toString());
    if(promoPoint>0){
      promoPoint= promoPoint+1;
      let i = 0;
      for (let index = 0; index < (promoCardData.slots + totalPromotion); index++) {
        let p: KeyValue<string,KeyValue<string,string>>;
        let val: KeyValue<string,string>;
        val = { key: String(index+1-i), value: String(index+1-i) };
        p = { key: String(index+1-i), value: val };
        if( ((index+1) % promoPoint ) == 0)
        {
          let val: KeyValue<string,string>;
          val = { key: 'Promo_' + (i+1), value: 'Promotion' };
          p = { key: 'Promo_' + (i+1), value: val };
          i++;
      }
        this.promogeneratedData.push(p)
      }
    }
    else
    for (let index = 0; index < promoCardData.slots; index++) {
      let p: KeyValue<string,KeyValue<string,string>>;
      let val: KeyValue<string,string>;
      val = { key: String(index+1), value: String(index+1) };
      p = { key: String(index+1), value: val };
      this.promogeneratedData.push(p)
    }
    this.getGeneratedPromData(this.promogeneratedData); //emitter
  }

  addPromoDescription(slot: KeyValue<string,string>){
    this.canEdit = this.canEdit && slot.key.indexOf('Promo_') > -1 && this.promoData.status == 'In-progress' ? true : false ;
    this.promogeneratedData = this.promoData && this.promoData.promoGrid  ? this.promoData.promoGrid : [];
    let data = {
      'slot' : slot, 
      'canEdit' : this.canEdit, 
      'isPromotionEntry' : true,
      'matIcon': 'add_box',
      'label': 'Promotion description'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    })
    this.getGeneratedPromData(this.promogeneratedData); //emitter
  }

public getGeneratedPromData(data): void {
  this.onAfterPromoGeneratedData.emit(data);
}

addStampToCustomer(slot: KeyValue<string,string>){
  //TODO
  let previousAndNextSlots = this.getPreviousAndNextSolts(this.promoData.promoGrid,slot);
  let dialogNote = '';
  this.canEdit = slot.key.indexOf('Taken_') > -1 ? false : true;
  if(this.canEdit && previousAndNextSlots.previous != null){
    this.canEdit = (previousAndNextSlots.previous.key.indexOf('Taken_')> -1) ? true : false;
    dialogNote = this.canEdit ? '' : 'Please stamp the previous slot.';
  } else if(previousAndNextSlots.previous != null){
    dialogNote = ( previousAndNextSlots.previous.key.indexOf('Promo_')> -1 
                    && previousAndNextSlots.previous.key.indexOf('Taken_Promo_') < 0 ) 
                    ? 'Please use the ' + previousAndNextSlots.previous.key + ' slot.' : '';
  }
  this.promogeneratedData = this.promoData && this.promoData.promoGrid  ? this.promoData.promoGrid : [];
  this.getProductList();
    let data = {
      'promotionValue' : slot.value['value'],
      'slot' : slot, 
      'canEdit' : this.canEdit, 
      'isStampEntry' : true,
      'matIcon': 'add_box',
      'label': 'Stamp',
      'note': dialogNote
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if(result != 'cancel'){
        let res = JSON.parse(result);
        this.promoData.modifiedBy = this.currentUserId; //From local storage
        this.promoData.modifiedDate = this.currentDate.toLocaleString();
        this.promoData.promoGrid.forEach((value)=>{
          if(value.key == res.key){
            value.key = 'Taken_' + res.key;
            let product;
            this.productList.forEach((p)=>{
              if(p['key'] == value.value.value)
              product = p;
            })
            value.value.value = res.key.indexOf('Promo_')> -1 ? JSON.stringify({promotion:data.promotionValue,claimed: {key: product['key'],title:product['title']}}) : JSON.stringify({key: product['key'],title:product['title']});
            console.log(value.value.value)
            //value.value.value = JSON.stringify({key: product['key'],title:product['title']});
            // if(res.key.indexOf('Promo_')> -1){
            //   value.value.value = res.key.indexOf('Promo_')> -1 ? JSON.stringify({promotion:data.promotionValue,claimed: {key: product['key'],title:product['title']}}) : JSON.stringify({key: product['key'],title:product['title']});
            //   console.log(value.value.value)
            // }
          }
        })
        //console.log(this.promoData)
        this.userContentService.updateItem(this.promoData); 
      }
    })
}

  getProductByKey(productKey: string) {
    return this.productList && this.productList.forEach((p)=>{
      if(p['key'] == productKey)
      return p;
    })
  }

  getPreviousAndNextSolts(promoGrid: KeyValue<string, KeyValue<string, string>>[], slot: KeyValue<string, string>) {
    let currentIndex = promoGrid.findIndex(x=> x.key == slot.key);
    return {
      'previous' : (currentIndex == 0) ? null : promoGrid[currentIndex-1],
      'next' : (currentIndex+1 == promoGrid.length) ? null : promoGrid[currentIndex+1]
    };
  }

delete(key: string){
  let data = {
    'title': 'Confirm', 
    'label':'Are you sure you want to remove this promotion card?', 
    'isConfirmDialog' : true,
    'matIcon': 'warning',
    'actionbtnlabel': 'Remove'
  };
  let dialogRef = this.dialog.open(DialogComponent, { data: data });
  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    if(result == 'ok') 
    this.promoCardService.deleteItem(key);
  })
}

publish(promoData: IPromotionCard){
  let data = {
    'title': 'Confirm', 
    'label':'Are you sure you want to publish this promotion card?',
    'note':'Once published,  this promotion card can not be edit in future.',
    'isConfirmDialog' : true,
    'matIcon': 'info',
    'actionbtnlabel': 'Publish'
  };
  let dialogRef = this.dialog.open(DialogComponent, { data: data });
  dialogRef.afterClosed().subscribe(result => {
    if(result === 'ok') {
      promoData.publishedBy = this.currentUserId; //From local storage
      promoData.publishedDate = this.currentDate.toLocaleString();
      promoData.status = 'Published'; //In-progress,Published
      this.promoCardService.updateItem(promoData.key,promoData);
    }
  })
}

assignPromoCardToUser(promoData: IPromotionCard){
  this.userContentService.addItem(promoData);
}

getPromoValue(slot: any){
  this.promoSlot = (slot.key.indexOf('Taken_Promo_')>-1) ? JSON.parse(slot.value.value) : slot.value;
}

getPromoValueFromslot(slotObj: any){
  if(slotObj != 'Taken' && slotObj){
    let obj = JSON.parse(slotObj);
  return obj['title'];
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

getProductList(){
  this.productService.items.subscribe((product)=> { 
  this.productList =   product ;
  });
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
  this.userContentServiceSubscription.unsubscribe();
}

}
