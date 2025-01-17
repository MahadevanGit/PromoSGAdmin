import { DatePipe, KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { ProductService } from '../../../product/services/product.service';
import { ProductStatsService } from '../../../product/services/product.stats.service';
import { JsonHelper, LocalStorageMember } from '../../../shared/models/common';
import { IProduct, IProductPurchasedInfo, ProductStats } from '../../../shared/models/product';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { UserContentService } from '../../../shared/services/user-content.service';
import { DialogComponent } from '../../../dialog/dialog.component';
import { AuthService } from '../../../shared/services/auth.service';
import { IPromotionCard } from '../../models/promotioncard';
import { PromoCardService } from '../../services/promo-card.service';
import { PromoCardDashboardComponent } from '../promo-card-dashboard/promo-card-dashboard.component';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';

@Component({
  selector: 'promo-card',
  templateUrl: './promo-card.component.html',
  styleUrls: ['./promo-card.component.scss'],
  providers: [PromoCardService, UserContentService, ProductService, AuthService]
})
export class PromoCardComponent implements OnInit, OnChanges, OnDestroy {

  @Input('promoData') promoData: IPromotionCard;
  @Input('canEdit') canEdit: boolean;
  @Input('action') action: any;
  @Output() onAfterPromoGeneratedData = new EventEmitter<any>();
  // @ViewChild(PromoCardDashboardComponent) promoCardDashboardComponent: PromoCardDashboardComponent;
  promogeneratedData: KeyValue<string, KeyValue<string, string>>[] = [];
  gridColumn: number = 6;
  userId: string;
  isAdmin: boolean = false;
  currentDate: Date;
  subscription: Subscription;
  currentUserId: string;
  productStatsObj: ProductStats;

  //assign promo card to user
  customerId: string | null;
  userContentServiceSubscription: Subscription;
  productSubscription: Subscription;
  customerAssignedPromoCardList: IPromotionCard[] = [];
  isPromoCardAssignedToCustomer: boolean = false;
  assignPromoCard: any;
  stampPromoCard: any;
  promoSlot: any;
  productList: IProduct[] =[];

  constructor(
    private loader: LoadingService,
    private flashMessageService: FlashMessageService,
    private dialog: MatDialog,
    private promoCardService: PromoCardService,
    private userContentService: UserContentService,
    private productService: ProductService,
    private productStatsService: ProductStatsService,
    public promoCardDashboardComponent: PromoCardDashboardComponent, // MyNote: This is child component injection way 1. way 2 is using @ViewChild.
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    //this.userId = this.route.snapshot.paramMap.get('userId');
    this.currentUserId = LocalStorageMember.get(LocalStorageMember.userId);
    this.subscription = this.auth.appUser$.subscribe(_user => { this.isAdmin = _user.isAdmin })
    this.promogeneratedData = this.promoData && this.promoData.promoGrid ? this.promoData.promoGrid : [];
    //assign promo card to user
    // this.assignPromoCard = this.route.snapshot.url.find(x => x.path == 'assignpromocard');
    // this.stampPromoCard = this.route.snapshot.url.find(x => x.path == 'stamppromocard');
    this.customerId = this.route.snapshot.paramMap.get('customerId');
  }

  ngOnInit(): void {
    this.getcustomerAssignedPromoCardList();
  }

  getcustomerAssignedPromoCardList() {
    try {
      this.loader.show();
      this.userContentServiceSubscription = this.userContentService
        .getItemsByCustomerId(this.customerId)
        .subscribe((value) => {
          this.customerAssignedPromoCardList = value;
          this.customerAssignedPromoCardList.forEach(element => {
            if (element.key == this.promoData.key) this.isPromoCardAssignedToCustomer = true;
          });
        })
    } catch (error) {
    } finally {
      this.loader.hide();
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changCustomerAct(changes);
    this.isPromoCardAssignedToCustomer = false;
    this.customerAssignedPromoCardList.forEach(element => {
      if (changes.promoData && (element.key == changes.promoData.currentValue.key))
        this.isPromoCardAssignedToCustomer = true;
    });
  }

  changCustomerAct(changes: SimpleChanges) {
    if (changes && changes.action && (changes.action.currentValue)) {
      this.assignPromoCard = changes.action.currentValue.assign ? true : false;
      this.stampPromoCard = changes.action.currentValue.stamp ? true : false;
    }
  }

  generatePromoData(parentPromoData) {
    let promoCardData = parentPromoData;
    promoCardData.slots = promoCardData.slots ? promoCardData.slots : 12;
    this.promogeneratedData = [];
    let promoPoint = promoCardData.promopoint;
    let totalPromotion = parseInt((promoCardData.slots / promoPoint).toString());
    if (promoPoint > 0) {
      promoPoint = promoPoint + 1;
      let i = 0;
      for (let index = 0; index < (promoCardData.slots + totalPromotion); index++) {
        let p: KeyValue<string, KeyValue<string, string>>;
        let val: KeyValue<string, string>;
        val = { key: String(index + 1 - i), value: String(index + 1 - i) };
        p = { key: String(index + 1 - i), value: val };
        if (((index + 1) % promoPoint) == 0) {
          let val: KeyValue<string, string>;
          val = { key: 'Promo_' + (i + 1), value: 'Promotion' };
          p = { key: 'Promo_' + (i + 1), value: val };
          i++;
        }
        this.promogeneratedData.push(p)
      }
    }
    else
      for (let index = 0; index < promoCardData.slots; index++) {
        let p: KeyValue<string, KeyValue<string, string>>;
        let val: KeyValue<string, string>;
        val = { key: String(index + 1), value: String(index + 1) };
        p = { key: String(index + 1), value: val };
        this.promogeneratedData.push(p)
      }
    this.getGeneratedPromData(this.promogeneratedData); //emitter
  }

  addPromoDescription(slot: KeyValue<string, string>) {
    this.canEdit = this.canEdit && slot.key.indexOf('Promo_') > -1 && this.promoData.status == 'In-progress' ? true : false;
    this.promogeneratedData = this.promoData && this.promoData.promoGrid ? this.promoData.promoGrid : [];
    let data = {
      'slot': slot,
      'canEdit': this.canEdit,
      'isPromotionEntry': true,
      'matIcon': 'add_box',
      'label': 'Promotion description'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
    })
    this.getGeneratedPromData(this.promogeneratedData); //emitter
  }

  public getGeneratedPromData(data): void {
    this.onAfterPromoGeneratedData.emit(data);
  }

  addStampToCustomer(slot: KeyValue<string, string>) {
    this.currentDate = new Date();
    let previousAndNextSlots = this.getPreviousAndNextSolts(this.promoData.promoGrid, slot);
    let dialogNote = '';
    this.canEdit = slot.key.indexOf('Taken_') > -1 ? false : true;
    if (this.canEdit && previousAndNextSlots.previous != null) {
      this.canEdit = (previousAndNextSlots.previous.key.indexOf('Taken_') > -1) ? true : false;
      dialogNote = this.canEdit ? '' : 'Please stamp the previous slot.';
    } else if (previousAndNextSlots.previous != null) {
      dialogNote = (previousAndNextSlots.previous.key.indexOf('Promo_') > -1
        && previousAndNextSlots.previous.key.indexOf('Taken_Promo_') < 0)
        ? 'Please use the ' + previousAndNextSlots.previous.key + ' slot.' : '';
    }
    this.promogeneratedData = this.promoData && this.promoData.promoGrid ? this.promoData.promoGrid : [];
    this.getProductList();
    let data = {
      'promotionValue': slot.value['value'],
      'slot': slot,
      'canEdit': this.canEdit,
      'isStampEntry': true,
      'matIcon': 'add_box',
      'label': 'Stamp',
      'note': dialogNote
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(async result => {
      let productPurchasedInfo: IProductPurchasedInfo;
      productPurchasedInfo = {purchased: { category: "",key:"", title: "", price: "", imageUrl: "", note: ""},
                                purchasedDate : ""};
      let res = (result != 'cancel' && result != 'close' && result) ? JSON.parse(result) : result;
      this.promoData.modifiedBy = this.currentUserId; //From local storage
      this.promoData.modifiedDate = this.currentDate.toLocaleString();
      this.promoData.promoGrid.forEach((value) => {
        if (value.key == res.key) {
          value.key = 'Taken_' + res.key;

          this.productList.forEach((p) => {
            console.log(p);
            if (p.key === value.value.value)
              productPurchasedInfo.purchased = p;
            productPurchasedInfo.purchasedDate = this.currentDate.toLocaleString();
          })
          value.value.value = JSON.stringify(productPurchasedInfo);
        }
      })
      if (result != 'cancel' && result != 'close') {
        this.userContentService.updateItem(this.promoData);

        //this is for show statictis of the sold product 
        this.productStatsObj = new ProductStats('', '', {})
        this.productStatsObj.productKey = productPurchasedInfo.purchased && productPurchasedInfo.purchased.key;
        this.productStatsObj.customerKey = this.customerId;
        this.productStatsObj.stats.purchaseDate = this.currentDate.toLocaleString();
        this.productStatsObj.stats.qty = 1; //Product quantity
        await this.productStatsService.addItem(this.productStatsObj);
        this.flashMessageService.success('Successfully stamped.');
      }
    })
  }

  getProductByKey(productKey: string): any {
    return this.productList && this.productList.forEach((p) => {
      if (p['key'] == productKey) {
        return p;
      }
    })
  }

  getPreviousAndNextSolts(promoGrid: KeyValue<string, KeyValue<string, string>>[], slot: KeyValue<string, string>) {
    let currentIndex = promoGrid.findIndex(x => x.key == slot.key);
    return {
      'previous': (currentIndex == 0) ? null : promoGrid[currentIndex - 1],
      'next': (currentIndex + 1 == promoGrid.length) ? null : promoGrid[currentIndex + 1]
    };
  }

  editPromoCard(key: string) {
    this.promoCardDashboardComponent && this.promoCardDashboardComponent.editPromoCard(key);
  }

  delete(key: string) {
    let data = {
      'title': 'Confirm',
      'label': 'Are you sure you want to remove this promotion card?',
      'isConfirmDialog': true,
      'matIcon': 'warning',
      'actionbtnlabel': 'Remove'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok') {
        this.loader.show();
        this.promoCardService.deleteItem(key);
        this.loader.hide();
        this.flashMessageService.success('Successfully removed promo card.');
      }

    })
  }

  publish(promoData: IPromotionCard) {
    this.currentDate = new Date();
    let data = {
      'title': 'Confirm',
      'label': 'Are you sure you want to publish this promotion card?',
      'note': 'Once published,  this promotion card can not be edit in future.',
      'isConfirmDialog': true,
      'matIcon': 'info',
      'actionbtnlabel': 'Publish'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        promoData.publishedBy = this.currentUserId; //From local storage
        promoData.publishedDate = this.currentDate.toLocaleString();
        promoData.status = 'Published'; //In-progress,Published
        this.loader.show();
        this.promoCardService.updateItem(promoData.key, promoData);
        this.loader.hide();
        this.flashMessageService.success('Successfully published.');
      }
    })
  }

  assignPromoCardToUser(promoData: IPromotionCard) {
    this.loader.show();
    this.userContentService.addItem(promoData);
    this.flashMessageService.success('Successfully assigned.')
    this.loader.hide();
  }

  getPromoValue(slot: any) {
    this.promoSlot = (slot.key.indexOf('Taken_Promo_') > -1) ? JSON.parse(slot.value.value) : slot.value;
  }

  getPromoValueFromslot(slotObj: IProductPurchasedInfo) {
    console.log(slotObj)
    if (slotObj && slotObj.purchased) {
      return slotObj.purchased.title;
    }
    return "";
  }

  getPromoValueFromClaimed(promoSlot: any) {
    //TODO : purchased product storing data structure modified on 25-08-2024
    //Delete all the data from firebase and keep only 
    //return obj['purchased']['title'];
    if (typeof (promoSlot) != 'string' && promoSlot['claimed']) {
      let title = promoSlot['claimed']['title'];
      return title;
    } else if (typeof (promoSlot) != 'string' && promoSlot['purchased']) {
      let title = promoSlot['purchased']['title'];
      return title;
    }
    return "";
  }

  getProductList() {
    try {
      this.loader.show();
      this.productService.getItemsByUserID().subscribe((product: IProduct[]) => {
        this.productList = product;
      });
    } catch (error) {
    } finally {
      this.loader.hide();
    }
  }

  isMenuDisabled() {
    return !(!this.canEdit && !this.isAdmin && (this.promoData.status && this.promoData.status === 'In-progress'));
  }

  getInitialValue(slotValue, slot?) {
    return this.productList ? this.getProductValueByKey(slotValue, slot) : this.getProductValueByKey(slotValue, slot);
  }

  getProductValueByKey(productKey, slot?) {
    let prod;
    this.productList && this.productList.forEach((p) => {
      if (p['key'] == productKey) {
        prod = p;
      }
    })
    return prod ? prod['title'] : slot ? slot.key : productKey;
  }

  getLimitedChar(value: string, limit: number) {
    return JsonHelper.getLimitedChar(value, limit);
  }

  getFormattedDate(value: Date) {
    return JsonHelper.getFormattedDate(value, 'dd-MMM-YYYY');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.userContentServiceSubscription.unsubscribe();
  }

}




