import { Component, ChangeDetectorRef, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppUser, User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserContentService } from 'src/app/user-content.service';
import { UserService } from 'src/app/user.service';
import { IPromotionCard } from '../../models/promotioncard';
import { PromoCardService } from '../../services/promo-card.service';

@Component({
  selector: 'app-promo-card-dashboard',
  templateUrl: './promo-card-dashboard.component.html',
  styleUrls: ['./promo-card-dashboard.component.scss'],
  providers:[PromoCardService,UserContentService]
})
export class PromoCardDashboardComponent implements OnInit, OnDestroy{
  isAdmin: boolean = false;
  userId: string;
  subscription: Subscription;
  auth_subscription: Subscription;
  promoCardList: any[];
  promoCardObj: any;
  actionData: any;

  //assign promo card to user
  customerId: string;
  assignPromoCard: UrlSegment;
  stampPromoCard: UrlSegment;
  userContentServiceSubscription: Subscription;
  customerAssignedPromoCardList: IPromotionCard[] =[];
  isPromoCardAssignedToCustomer: boolean = false;
  currentCustomer: any;
  

  constructor(
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private promoCardService: PromoCardService,
    private userContentService: UserContentService,
    private userService: UserService,
    private route: ActivatedRoute) { 
      this.auth_subscription = this.auth.appUser$.subscribe(_user=>{ this.isAdmin = _user.isAdmin })
      this.userId = this.route.snapshot.paramMap.get('userId');
      this.customerId = this.route.snapshot.paramMap.get('customerId');
      

    //   this.userContentServiceSubscription = this.userContentService
    //   .getItemsByCustomerId(this.customerId)
    //   .subscribe((userContentValue)=>{
    //   this.customerAssignedPromoCardList = userContentValue;
    //   console.log(this.customerAssignedPromoCardList)
    // });


    this.userService.getByUserId(this.customerId).take(1).subscribe((user)=>{
      this.currentCustomer = user;
    });

                        
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    //assign and stamp promo card to user
    this.assignPromoCard = this.route.snapshot.url.find(x=>x.path == 'assignpromocard');
    this.stampPromoCard = this.route.snapshot.url.find(x=>x.path == 'stamppromocard');
    this.actionData = { 'assign' : this.assignPromoCard ? true : false,
                        'stamp' : this.stampPromoCard ? true : false
                      };
    this.applyFilter();
  }

  applyFilter(event?){
    const filterValue = event ? (event.target as HTMLInputElement).value : "";
  if(this.stampPromoCard){
    //stamping on promo card to user - get only assigned promo card list
    this.promoCardList = [];
    this.userContentServiceSubscription = this.userContentService
      .getItemsByCustomerId(this.customerId)
      .subscribe((userContentValue)=>{
      this.customerAssignedPromoCardList = userContentValue;
      this.promoCardList = this.customerAssignedPromoCardList.filter(promoCardValue=>{
        return promoCardValue['title'].trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase());
      }).reverse();
      this.promoCardObj = this.promoCardList[0];
    });
  }
  else{
    this.subscription = (!this.userId) 
    ? 
      this.promoCardService.items.subscribe((promoCard)=> { 
        this.promoCardList = promoCard.filter(promoCardValue=> 
          { 
            if(this.assignPromoCard)
            //assign promo card to user - get only published promo card list
            return promoCardValue['title'].trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase()) 
                    && (this.assignPromoCard && promoCardValue.status == 'Published');
            else
            //get all promo card list
            return promoCardValue['title'].trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase());
          }).reverse();
        this.promoCardObj = this.promoCardList[0];
      }) 
    : 
      this.promoCardService.getItemsByUserID(this.userId).subscribe((promoCard)=> { 
        this.promoCardList = promoCard.filter(promoCardValue=> 
          { 
            //get all promo card list
            return promoCardValue['title'].trim().toLocaleLowerCase().includes(filterValue.trim().toLocaleLowerCase());
          }).reverse();
        this.promoCardObj = this.promoCardList[0];
      });
  }
  }

  getpromoCard(key: string){
    this.promoCardObj = this.promoCardList.find((value)=>{
      return value.key == key;
    })
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe() ;
    if(this.auth_subscription) this.auth_subscription.unsubscribe() ;
    if(this.userContentServiceSubscription) this.userContentServiceSubscription.unsubscribe() ;
  }

}
