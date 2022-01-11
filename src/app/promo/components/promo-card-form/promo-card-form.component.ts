import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { LocalStorageMember } from '../../../shared/models/common';
import { IPromotionCard } from '../../models/promotioncard';
import { PromoCardService } from '../../services/promo-card.service';

@Component({
  selector: 'promo-card-form',
  templateUrl: './promo-card-form.component.html',
  styleUrls: ['./promo-card-form.component.scss'],
  providers: [PromoCardService]
})
export class PromoCardFormComponent implements OnInit {
  promoCard: any = {};
  promotionCard: IPromotionCard;
  //promoData: KeyValue<string,string>[] = [];
  promoGrid: KeyValue<string, KeyValue<string, string>>[] = [];
  minDate: Date;
  maxDate: Date;
  minExpiryDate: Date;
  maxExpiryDate: Date;
  //promoCardKey: string;
  currentDate: Date = new Date();
  currentUserId: string;

  @Input('promoCardKey') promoCardKey: string;
  @ViewChild("promoCardFormTag") promoCardForm: NgForm; //to select the template driven form element inside .ts code
  notificationMessage: string;
  @Output() amDone = new EventEmitter<boolean>(false);

  constructor(
    private loader: LoadingService,
    private promoCardService: PromoCardService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.minExpiryDate = new Date();
    this.maxDate = new Date(currentYear + 2, 11, 31);
    this.maxExpiryDate = new Date(currentYear + 2, 11, 31);
    // this.promoCardKey = this.route.snapshot.paramMap.get('key');
    this.currentUserId = LocalStorageMember.get(LocalStorageMember.userId);
  }

  ngOnInit(): void {
    this.customInit('');
  }

  customInit(mode: any) {
    try {
      this.loader.show();
      this.getpromoCard();
    } catch (error) {
    } finally {
      this.loader.hide();
    }
  }

  getpromoCard() {
    try {
      if (this.promoCardKey) {
        this.loader.show();
        this.promoCardService
          .getItem(this.promoCardKey)
          .valueChanges()
          .take(1)
          .subscribe(
            (value) => {
              this.promoCard = value;
              this.promoCard.startDate = new Date(this.promoCard.startDate);
              this.promoCard.expiryDate = new Date(this.promoCard.expiryDate);
            })
      }
    } catch (error) {

    } finally {
      this.loader.hide();
    }
  }

  async onSubmit(promoCardData: IPromotionCard, startDate, expiryDate) {
    try {
      this.loader.show();
      if (this.promoCardKey) {
        this.promoCard.modifiedBy = this.currentUserId;
        this.promoCard.modifiedDate = this.currentDate.toLocaleString();
        await this.promoCardService.updateItem(this.promoCardKey, this.promoCard)
        this._amDone(true); //emitter
      }
      else {
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
        this._amDone(true); //emitter
      }
      // this.router.navigate(['/promocarddb']);
      this.resetPromoCardForm(this.promoCardForm);
    } catch (e) {
      console.log(e)
      //TODO: Need to check .. Currently could not catch exception
    } finally {
      this.loader.hide();
    }
  }

  resetPromoCardForm(promoCardForm: NgForm) {
    promoCardForm.resetForm();
    this.promoCard = {};
    this.promoCard.promoGrid = [];
  }

  //emitter
  public _amDone(data: boolean): void {
    this.amDone.emit(data);
  }

  public GetpromoDataFromPromoCardComp(promoDataFromPromCardCompEmit: any): void {
    this.promoGrid = promoDataFromPromCardCompEmit;
    this.promoCard.promoGrid = this.promoGrid;
  }

}
