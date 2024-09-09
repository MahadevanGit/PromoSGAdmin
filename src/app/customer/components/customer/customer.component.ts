import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ShopCustomerService } from '../../services/customer.service';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Convert } from 'src/app/shared/models/user';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers: [UserService, ShopCustomerService]
})
export class CustomerComponent implements OnInit, OnDestroy {
  customerDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  subscription: Subscription;
  auth_subscription: Subscription;
  customer_subscription: Subscription;
  user_subscription: Subscription;
  isAdmin: boolean = false;
  userId: string;
  shopCustomerList: any[] = [];
  customerList: any[] = [];
  imgSrc = 'assets/images/image-placeholder.png';

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.customerDataSource && !this.customerDataSource.sort) {
      this.customerDataSource.sort = sort;
    }
  }
  //table column disply by this sequence
  customerDisplayedColumns: string[] = ['image', 'firstname', 'email', 'action'];
  constructor(
    private loader: LoadingService,
    private customerService: ShopCustomerService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService) {
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    try {
      this.loader.show();
      this.auth_subscription = this.auth.appUser$.subscribe(_user => {
        this.isAdmin = _user.isAdmin;
        this.userId = _user.userId;
      })

      this.customer_subscription = (!this.userId)
        ? this.customerService.itemsRef
          .valueChanges()
          .subscribe((customer) => {
            this.shopCustomerList = customer;
          })
        :
        this.customerService.getItemsByShopUserID(this.userId)
          .valueChanges()
          .subscribe((customer) => {
            this.shopCustomerList = customer;
          })

      this.user_subscription = this.userService.getAllUser().subscribe((users) => {
        this.customerList = [];
        // users object from firebase is key and user object
        // we have to use Object calss to get only values [Object.values]
        // for get keys only [Object.keys]
        Object.values(users).forEach(
          (u) => {
            console.log(u)
            this.shopCustomerList.forEach(
              (c) => {
                console.log(c)
                if (c == u.uid)
                  this.customerList.push(u)
              });
          });
        this.customerDataSource = new MatTableDataSource(this.customerList);
        this.customerDataSource.paginator = this.paginator;
      })

    } catch (error) {

    } finally {
      this.loader.hide();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.customerDataSource.filter = filterValue.trim().toLowerCase();
    if (this.customerDataSource.paginator) {
      this.customerDataSource.paginator.firstPage();
    }
  }

  delete(id) {
    // TO DO
  }

  ngOnDestroy(): void {
    this.auth_subscription.unsubscribe();
    this.customer_subscription.unsubscribe();
    this.user_subscription.unsubscribe();
  }

}
