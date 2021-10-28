import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PromoCardService } from '../../services/promo-card.service';
import { LocalStorageMember } from '../../../shared/models/common';
import { IPromotionCard } from '../../models/promotioncard';
@Component({
  selector: 'app-promo-card-form',
  templateUrl: './promo-card-form.component.html',
  styleUrls: ['./promo-card-form.component.scss'],
  providers:[PromoCardService]
})
export class PromoCardFormComponent {
   promoCard: any = {};
   promotionCard: IPromotionCard;
   //promoData: KeyValue<string,string>[] = [];
   promoGrid: KeyValue<string,KeyValue<string,string>>[] = [];
   minDate: Date;
   maxDate: Date;
   minExpiryDate: Date;
   maxExpiryDate: Date;
   promoCardKey: string;
   currentDate: Date = new Date();
   currentUserId: string;
   localStorage = new LocalStorageMember();
  
  constructor(
    private promoCardService: PromoCardService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.minExpiryDate = new Date();
    this.maxDate = new Date(currentYear + 2, 11, 31);
    this.maxExpiryDate = new Date(currentYear + 2, 11, 31);
    this.promoCardKey = this.route.snapshot.paramMap.get('key');
    this.currentUserId = this.localStorage.get(this.localStorage.userId);
    if(this.promoCardKey) {
      this.promoCardService
      .getItem(this.promoCardKey)
      .valueChanges()
      .take(1)
      .subscribe(
        (value)=>
        {
          this.promoCard = value;
          this.promoCard.startDate = new Date(this.promoCard.startDate);
          this.promoCard.expiryDate = new Date(this.promoCard.expiryDate);
        })
    }
    
   }

  async onSubmit(promoCardData: IPromotionCard,startDate,expiryDate) {
    try {
      if(this.promoCardKey){
        this.promoCard.modifiedBy = this.currentUserId;
        this.promoCard.modifiedDate = this.currentDate.toLocaleString();
        await this.promoCardService.updateItem(this.promoCardKey,this.promoCard)
      }
      else{
        promoCardData.startDate = startDate.toDateString();
        promoCardData.expiryDate = expiryDate.toDateString();
        promoCardData.promoGrid = this.promoGrid;
        promoCardData.createdBy = this.currentUserId;
        promoCardData.createdDate = this.currentDate.toLocaleString();
        promoCardData.modifiedBy = this.currentUserId;
        promoCardData.modifiedDate = this.currentDate.toLocaleString();
        promoCardData.status = 'In-progress'; //In-progress,Published
        promoCardData.isActive = true;
         
        await this.promoCardService.addItem(promoCardData);
      }
      this.router.navigate(['/promocarddb']);
    } catch (e) {
      console.log(e)
       //TODO: Need to check .. Currently could not catch exception
    }
}

public GetpromoDataFromPromCardComp(promoDataFromPromCardCompEmit: any):void {
  this.promoGrid = promoDataFromPromCardCompEmit;
  this.promoCard.promoGrid = this.promoGrid;
}

}