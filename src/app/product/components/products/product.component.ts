import { AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../../shared/models/product'
import { AuthService } from 'src/app/shared/services/auth.service';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { MatMenuListItem } from 'src/app/shared/models/common';
import { MenuIconDdComponent } from 'src/app/shared/components/control/menu-icon-dd/menu-icon-dd.component';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers:[
    ProductService,
    CategoryService,
    AuthService] // ProductService won't destroyed if you dont provide the service in providers.
})

export class ProductComponent implements OnInit, OnDestroy, AfterViewChecked{

  menuListItems: MatMenuListItem[];
  productDataSource: MatTableDataSource<IProduct>;
  imageFolderName: string = '/product-imageDetails/';
  imageRequestType: string =  'product'; //'usersetting';
  rootPath: string = 'shop-user-content/current-user-id/product-imageDetails/';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedProductKey: string;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.productDataSource && !this.productDataSource.sort) {
        this.productDataSource.sort = sort;
    }
  }

  imageLoader = true;
  product_subscription: Subscription
  auth_subscription: Subscription
  category_subscription: Subscription
  userId: string;
  selectedMenuItem: string;
  defaultSelection: MatMenuListItem;
  //table column disply by this sequence
  productDisplayedColumns: string[] = ['image','title','category', 'price', 'action'];  
  isAdmin: boolean = false;
  categories: any  [];  
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    public menuiconcomp: MenuIconDdComponent,
    private cdr: ChangeDetectorRef,
    ) { 
      this.userId = this.route.snapshot.paramMap.get('userId');
      this.auth_subscription = this.auth.appUser$.subscribe(_user=>{ this.isAdmin = _user.isAdmin })
}
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this.loadCategory();
    this.loadMatMenuListItem();
    await this.loadProduct();
    
  }

  async loadMatMenuListItem(){
    this.menuListItems = this.menuListItems = [
      {
        menuLinkText: 'Products',
        menuLinkKey: 'products',
        menuIcon: 'view_list',
        isDisabled:false,
        selected:true
      },
      {
        menuLinkText: 'Create Product',
        menuLinkKey: 'product-form',
        menuIcon: 'add_box',
        isDisabled:false,
        selected:false
      },
      {
        menuLinkText: 'Add Image',
        menuLinkKey: 'image-form', 
        menuIcon: 'add_photo_alternate',
        isDisabled:false,
        selected:false
      },
      { 
        menuLinkText:'Product Image Gallery',
        menuLinkKey:'image-gallery',
        menuIcon:'collections',
        isDisabled:false,
        selected:false
      }
];

this.onChildComplete();
  }



  public GetSelectedValues(menuLinkKey: string):void {
    this.selectedProductKey = null;
    this.editProduct(null);
    this.selectedMenuItem = menuLinkKey;
  }

  async loadCategory(): Promise<any> {
    try {
    this.category_subscription = (!this.userId) 
    ? 
    await this.categoryService
    .getItems()
    .valueChanges()
    .subscribe((value)=>{
      this.categories = value;
    }) 
    : 
    //this is for aip-admin user
    await this.categoryService
    .getItemsByUserID(this.userId)
    .subscribe((value)=>{
      this.categories = value;
    }) ;
    } catch (error) {
      console.log(error)
    } finally{
    }
  }

  async loadProduct(): Promise<any> {
    try {
      this.product_subscription = (!this.userId) 
    ? 
    await this.productService.getItemsByUserID().subscribe((product)=> { 
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
    //this is for aip-admin user
    this.product_subscription = await this.productService.getItemsByUserID(this.userId).subscribe((product)=> { 
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
    } catch (error) {
      console.log(error)
    }
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDataSource.filter = filterValue.trim().toLowerCase();
    if (this.productDataSource.paginator) {
      this.productDataSource.paginator.firstPage();
    }
  }

  deleteProduct(key: string){
    let data = {
      'title': 'Confirm', 
      'label':'Are you sure you want to remove this product?', 
      'isConfirmDialog' : true,
      'matIcon': 'warning',
      'actionbtnlabel': 'Remove'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'ok') 
      this.productService.deleteItem(key);
    })
  }

  editProduct(productKey: string){
    this.selectedProductKey = productKey;
    this.selectedMenuItem = this.menuListItems[1].menuLinkKey;
  }

  public onChildComplete(data?: any):void {
    if(this.menuListItems){
      this.defaultSelection = this.menuListItems? this.menuListItems[0] : null;
      
      this.menuiconcomp.clickMenuItem(this.defaultSelection);
      this.GetSelectedValues(this.defaultSelection.menuLinkKey);
      }
    else
      this.loadMatMenuListItem();
  }

  testbtn(){
    this.GetSelectedValues(this.menuListItems[1].menuLinkKey);
    this.defaultSelection = this.menuListItems[1]
    this.menuiconcomp.changeView(this.defaultSelection);
  }

  ngOnDestroy(): void {
    ////console.log('ngOnDestroy is called from product components....')
    this.product_subscription && this.product_subscription.unsubscribe();
    this.auth_subscription && this.auth_subscription.unsubscribe();
    this.category_subscription && this.category_subscription.unsubscribe();
  }

}
