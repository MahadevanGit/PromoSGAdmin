import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { LocalStorageMember } from '../../../shared/models/common';
import 'rxjs/add/operator/take'
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { from, Subscription } from 'rxjs';
import { KeyValue } from '@angular/common';
import { ImageService } from 'src/app/shared/services/image.service';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers:[CategoryService,ProductService,ImageService]
})
export class ProductFormComponent implements OnInit,OnDestroy {

  error: string;
  categorySubscription: Subscription;
  imageSubscription: Subscription;
  localStorageMember = new LocalStorageMember();
  categoryList$;
  categoryList: any[] = [];
  categoryAllList: any[] = [];
  selectedCategoryValue: string;
  product: any = {};
  imageList: any[];
  productKey: string;
  isProductForm: boolean = true;
  userId: string;

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private productService: ProductService,
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
    ) { 
    
    this.userId = this.localStorageMember.get(this.localStorageMember.userId);
    this.categorySubscription = this.categoryService
    .getItemsWithMap(this.userId).subscribe((value)=>{
      this.categoryList = [];
      this.categoryAllList = value;
      value.forEach((cat) => {
        if(cat['active']==true) 
        this.categoryList.push(cat);});
    });

    this.productKey = this.route.snapshot.paramMap.get('id');
    if(this.productKey) this.productService.getItem(this.productKey).valueChanges().take(1)
    .subscribe(
      (value)=>{
        this.product = value;
        console.log(this.product)
        this.getImageList(this.product['category'],false);
      })
  }
  

  ngOnInit(): void {
     
  }

  async onSubmit(productData) {

       try {
         if(this.productKey)
          await this.productService.updateItem(this.productKey,productData)
         else
          await this.productService.addItem(productData);
         this.router.navigate(['/products']);
       } catch (e) {
          //TODO: Need to check .. Currently could not catch exception
       }
  }

  createOrUpdateCategory(){
    let categoryNameList = [] ;
    this.categoryList.filter(element => {
      categoryNameList.push(element.value.toLowerCase());
    });
    let slot = {'key':'Category','value':'','existingData': this.categoryList}
    let data = {
      'slot' : slot, 
      'canEdit' : true, 
      'isCategoryEntry' : true,
      'matIcon': 'add_box',
      'label': 'Category'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    let categoryData: any;
    dialogRef.afterClosed().subscribe(result => {
      if(result != 'cancel'){
        let re = / /gi; 
        let key = result.replace(re,"");
        categoryData = { 'key': key.toLowerCase(), 'value': result, 'active': true};
        this.categoryService.addItem(categoryData);
      }
    })
  }

  removeCategory(){
    let slot = {'key':'Category','value':'','existingData': this.categoryAllList}
    let data = {
      'slot' : slot, 
      'canEdit' : true, 
      'isCategoryRemove' : true,
      'matIcon': 'block',
      'label': 'Category'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if(result != 'cancel'){
        let updatedData = JSON.parse(result);
        updatedData.forEach(element => {
          this.categoryService.updateItem(element.id,element);
        });
      }
    })
  }

  getImageList(_categoryKey: any,fromUI: boolean) {
    console.log(fromUI)
    this.setCategoryValueByKey(_categoryKey);
    this.product['imageUrl'] = this.productKey && !fromUI ? this.product['imageUrl'] : '';
    this.imageSubscription = this.imageService
    .getImageListByCategory(this.userId,_categoryKey).take(1).subscribe((value)=>{
      this.imageList = [];
      value.forEach((img) => {
        Object.keys(img).length;
        this.imageList.push(img)
        });
    });
  }

  setCategoryValueByKey(_categoryKey: string): void {
    this.categoryAllList.find((cat)=>{
      if(cat['key'] == _categoryKey)
          this.selectedCategoryValue = cat['value']; 
        });
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }

  
}
