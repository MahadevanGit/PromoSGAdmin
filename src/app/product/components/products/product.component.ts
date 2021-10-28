import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../shared/models/product'
import { AuthService } from 'src/app/shared/services/auth.service';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers:[
    ProductService,
    CategoryService,
    AuthService] // ProductService won't destroyed if you dont provide the service in providers.
})

export class ProductComponent implements OnInit, OnDestroy{

  productDataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.productDataSource && !this.productDataSource.sort) {
        this.productDataSource.sort = sort;
    }
  }

  imageLoader = true;
  subscription: Subscription
  auth_subscription: Subscription
  category_subscription: Subscription
  userId: string;
  //table column disply by this sequence
  productDisplayedColumns: string[] = ['image','title','category', 'price', 'action'];  
  isAdmin: boolean = false;
  categories: any  [];  
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private categoryService: CategoryService,
    private dialog: MatDialog
    ) { 
  this.userId = this.route.snapshot.paramMap.get('userId');
  this.auth_subscription = this.auth.appUser$.subscribe(_user=>{ this.isAdmin = _user.isAdmin })

  this.category_subscription = (!this.userId) 
  ? 
  this.categoryService
  .getItems()
  .valueChanges()
  .subscribe((value)=>{
    this.categories = value;
  }) 
  : 
  this.category_subscription = this.categoryService
  .getItemsByUserID(this.userId)
  .subscribe((value)=>{
    this.categories = value;
  }) ;

  this.subscription = (!this.userId) 
  ? 
  this.productService.items.subscribe((product)=> { 
    product.forEach(
      (p)=>{
        this.categories.forEach(
          (c)=>{
            if(c.key === p.category)
            p.category = c.value;
          });
        });
    this.productDataSource = new MatTableDataSource(product);
    this.productDataSource.paginator = this.paginator;
  }) 
  : 
  this.productService.getItemsByUserID(this.userId).subscribe((product)=> { 
    product.forEach(
      (p)=>{
        this.categories.forEach(
          (c)=>{
            if(c.key === p.category)
            p.category = c.value;
          });
        });
    this.productDataSource = new MatTableDataSource(product);
    this.productDataSource.paginator = this.paginator;
  });
}


  ngOnInit(): void {
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDataSource.filter = filterValue.trim().toLowerCase();
    if (this.productDataSource.paginator) {
      this.productDataSource.paginator.firstPage();
    }
  }

  delete(key: string){
    let data = {
      'title': 'Confirm', 
      'label':'Are you sure you want to remove this product?', 
      'isConfirmDialog' : true,
      'matIcon': 'warning',
      'actionbtnlabel': 'Remove'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result == 'ok') 
      this.productService.deleteItem(key);
    })
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy is called from product components....')
    this.subscription.unsubscribe();
    this.auth_subscription.unsubscribe();
    this.category_subscription.unsubscribe();
  }

}
