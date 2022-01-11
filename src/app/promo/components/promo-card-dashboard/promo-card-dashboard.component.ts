import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MatMenuListItem } from 'src/app/shared/models/common';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserContentService } from 'src/app/shared/services/user-content.service';
import { UserService } from 'src/app/shared/services/user.service';
import { IPromotionCard } from '../../models/promotioncard';
import { PromoCardService } from '../../services/promo-card.service';
import { PromoCardFormComponent } from '../promo-card-form/promo-card-form.component';

@Component({
  selector: 'app-promo-card-dashboard',
  templateUrl: './promo-card-dashboard.component.html',
  styleUrls: ['./promo-card-dashboard.component.scss'],
  providers: [PromoCardService, UserContentService]
})
export class PromoCardDashboardComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  userId: string;
  subscription: Subscription;
  auth_subscription: Subscription;
  promoCardList: any[];
  promoCardObj: any;
  actionData: any;

  //assign promo card to user
  customerId: string;
  // assignPromoCard: UrlSegment;
  // stampPromoCard: UrlSegment;
  assignPromoCard: string;
  stampPromoCard: string;
  userContentServiceSubscription: Subscription;
  customerAssignedPromoCardList: IPromotionCard[] = [];
  isPromoCardAssignedToCustomer: boolean = false;
  currentCustomer: User;

  //menu-icon-dd fields start
  //required
  selectedProductKey: string;
  selectedMenuItem: string;
  defaultSelection: MatMenuListItem;
  menuListItems: MatMenuListItem[];
  customerAct: UrlSegment;
  //menu-icon-dd fields end

  //menu-icon-dd ForDB fields start
  //optional
  @ViewChild(PromoCardFormComponent) promoCardFormComponent: PromoCardFormComponent;
  selectedPromoCardKey: string;
  //required
  selectedProductKeyForDB: string;
  selectedMenuItemForDB: string;
  defaultSelectionForDB: MatMenuListItem;
  menuListItemsForDB: MatMenuListItem[];
  customerActForDB: UrlSegment;
  //menu-icon-dd fields end


  constructor(
    private loader: LoadingService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private promoCardService: PromoCardService,
    private userContentService: UserContentService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {
    this.auth_subscription = this.auth.appUser$.subscribe(_user => { this.isAdmin = _user.isAdmin })
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    //   this.userContentServiceSubscription = this.userContentService
    //   .getItemsByCustomerId(this.customerId)
    //   .subscribe((userContentValue)=>{
    //   this.customerAssignedPromoCardList = userContentValue;
    //   console.log(this.customerAssignedPromoCardList)
    // });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.customerAct = this.route.snapshot.url.find(x => x.path == 'customer-act');

    if (this.customerAct) {
      // Assign / Stamp Promo card view
      this.loadMatMenuListItem();
    }
    else {
      // Promo card dash board / Create view
      this.loadMatMenuListItemForDB();
    }
    this.getCurrentCustomer();
    //assign and stamp promo card to user
    // this.assignPromoCard = this.route.snapshot.url.find(x => x.path == 'assignpromocard');
    // this.stampPromoCard = this.route.snapshot.url.find(x => x.path == 'stamppromocard');
    // this.actionData = {
    //   'assign': this.assignPromoCard ? true : false,
    //   'stamp': this.stampPromoCard ? true : false
    // };
    this.applyFilter();
  }

  // Promo card dash board / Create view
  loadMatMenuListItemForDB() {
    this.menuListItemsForDB = this.menuListItemsForDB = [
      {
        menuLinkText: 'Promo card',
        menuLinkKey: 'promoCard',
        menuIcon: 'stars',
        isDisabled: false,
        selected: true
      },
      {
        menuLinkText: 'Create promo card',
        menuLinkKey: 'promoCard-form',
        menuIcon: 'add_box',
        isDisabled: false,
        selected: false
      }
    ];
    this.onChildCompleteForDB();
  }

  onChildCompleteForDB() {
    if (this.menuListItemsForDB) {
      this.defaultSelectionForDB = this.menuListItemsForDB ? this.menuListItemsForDB[0] : null;
      this.onSelectForDB(this.defaultSelectionForDB.menuLinkKey);
    }
    else
      this.loadMatMenuListItemForDB();
  }

  onSelectForDB(menuLinkKey: string) {
    if (menuLinkKey == 'promoCard-form') {
      this.promoCardFormComponent && this.promoCardFormComponent.customInit('create');
      this.selectedMenuItemForDB = null;
      this.editPromoCard(this.selectedPromoCardKey ? this.selectedPromoCardKey : null);
    }
    else {
      this.selectedPromoCardKey = null;
    }
    this.selectedMenuItemForDB = menuLinkKey;
    this.applyFilter();
  }

  // Assign / Stamp Promo card view
  loadMatMenuListItem() {
    this.menuListItems = this.menuListItems = [
      {
        menuLinkText: 'Assign promo card',
        menuLinkKey: 'assign-promo-card',
        menuIcon: 'share',
        isDisabled: false,
        selected: true
      },
      {
        menuLinkText: 'Stamp promo card',
        menuLinkKey: 'stamp-promo-card',
        menuIcon: 'star',
        isDisabled: false,
        selected: false
      },
      {
        menuLinkText: 'Customer',
        menuLinkKey: 'customer',
        menuIcon: 'people',
        isDisabled: false,
        selected: false
      }
    ];
    this.onChildComplete();
  }

  public onChildComplete(data?: any): void {
    if (this.menuListItems) {
      this.defaultSelection = this.menuListItems ? this.menuListItems[0] : null;
      this.onSelect(this.defaultSelection.menuLinkKey);
    }
    else
      this.loadMatMenuListItem();
  }

  public onSelect(menuLinkKey: string): void {
    this.selectedMenuItem = menuLinkKey;
    //route to customer
    if (this.selectedMenuItem == 'customer')
      this.router.navigate(['/customers']);
    this.assignPromoCard = this.selectedMenuItem == 'assign-promo-card' ? this.selectedMenuItem : undefined;
    this.stampPromoCard = this.selectedMenuItem == 'stamp-promo-card' ? this.selectedMenuItem : undefined;
    this.actionData = {
      'assign': this.assignPromoCard ? true : false,
      'stamp': this.stampPromoCard ? true : false
    };
    this.applyFilter();
  }

  getCurrentCustomer() {
    try {
      this.userService.getByUserId(this.customerId).take(1).subscribe((user) => {
        this.currentCustomer = user;
      });
    } catch (error) {
    } finally {
    }
  }

  async applyFilter(event?) {
    // this.loader.show();
    const filterValue = event ? (event.target as HTMLInputElement).value : "";
    try {
      if (this.stampPromoCard) {
        //stamping on promo card to user - get only assigned promo card list
        this.promoCardList = [];
        this.userContentServiceSubscription = this.userContentService
          .getItemsByCustomerId(this.customerId)
          .subscribe((userContentValue) => {
            this.customerAssignedPromoCardList = userContentValue;
            this.promoCardList = this.customerAssignedPromoCardList.filter(promoCardValue => {
              return promoCardValue['title'].trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase());
            }).reverse();
            this.promoCardObj = this.promoCardList[0];
          });
      }
      else {
        this.subscription = (!this.userId)
          ?
          this.promoCardService.items.subscribe((promoCard) => {
            this.promoCardList = promoCard.filter(promoCardValue => {
              if (this.assignPromoCard)
                //assign promo card to user - get only published promo card list
                return promoCardValue['title'].trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase())
                  && (this.assignPromoCard && promoCardValue.status == 'Published');
              else
                //get all promo card list
                return promoCardValue['title'].trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase());
            }).reverse();
            this.promoCardObj = this.promoCardList[0];
          })
          : // For admin user
          this.promoCardService.getItemsByUserID(this.userId).subscribe((promoCard) => {
            this.promoCardList = promoCard.filter(promoCardValue => {
              //get all promo card list
              return promoCardValue['title'].trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase());
            }).reverse();
            this.promoCardObj = this.promoCardList[0];
          });
      }
    } catch (error) {
    } finally {
      // await this.loader.hide(15000); //loader name is xxx
    }
  }

  getpromoCard(key: string) {
    this.promoCardObj = this.promoCardList.find((value) => {
      return value.key == key;
    })
  }

  //PromoCardForm
  editPromoCard(promoCardKey: string) {
    this.selectedPromoCardKey = promoCardKey;
    this.selectedMenuItemForDB = this.menuListItemsForDB[1].menuLinkKey;
  }

  //PromoCardForm
  isPromoCardFormDone(isPromoCardFormDone: boolean) {
    if (isPromoCardFormDone)
      this.onChildCompleteForDB();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.auth_subscription) this.auth_subscription.unsubscribe();
    if (this.userContentServiceSubscription) this.userContentServiceSubscription.unsubscribe();
  }

}
