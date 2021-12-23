import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { LocalStorageMember, MatMenuListItem } from '../../../shared/models/common';
import 'rxjs/add/operator/take'
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { from, Subscription } from 'rxjs';
import { KeyValue } from '@angular/common';
import { ImageService } from 'src/app/shared/services/image.service';
import { NgForm } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers: [CategoryService, ProductService, ImageService]
})
export class ProductFormComponent implements OnInit, OnDestroy {

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
  isProductForm: boolean = true;
  userId: string;

  @Input('productKey') productKey: string;
  @ViewChild("productFormTag") productForm: NgForm; //to select the template driven form element inside .ts code
  notificationMessage: string;
  @Output() amDone = new EventEmitter<boolean>(false);

  constructor(
    private loader: LoadingService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private productService: ProductService,
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    // this.userId = this.localStorageMember.get(this.localStorageMember.userId);
    // this.categorySubscription = this.categoryService
    //   .getItemsWithMap(this.userId).subscribe((value) => {
    //     this.categoryList = [];
    //     this.categoryAllList = value;
    //     value.forEach((cat) => {
    //       if (cat['active'] == true)
    //         this.categoryList.push(cat);
    //     });
    //   });

    // if (this.productKey) this.productService.getItem(this.productKey).valueChanges().take(1)
    //   .subscribe(
    //     (value) => {
    //       this.product = value;
    //       this.getImageList(this.product['category'], false);
    //     })

  }

  ngOnInit(): void {
    this.customInit('');
  }

  // customInit(mode: any) {
  //   this.notificationMessage = "";
  //   if (mode == 'create') {
  //     this.productKey = null;
  //     this.productForm && this.productForm.resetForm();
  //   } else if (this.productKey) {
  //     this.productService.getItem(this.productKey).valueChanges().take(1)
  //       .subscribe(
  //         (value) => {
  //           this.product = value;
  //           this.getImageList(this.product['category'], false);
  //         })
  //   }
  // }

  customInit(mode: any) {
    console.log('customInit => ', mode)
    this.notificationMessage = "";
    this.userId = this.localStorageMember.get(this.localStorageMember.userId);
    try {
      this.loader.show();
      this.categorySubscription = this.categoryService
        .getItemsWithMap(this.userId).subscribe((value) => {
          this.categoryList = [];
          this.categoryAllList = value;
          value.forEach((cat) => {
            if (cat['active'] == true)
              this.categoryList.push(cat);
          });
        });
      if (mode == 'create') {
        this.productKey = null;
        this.productForm && this.productForm.resetForm();
      } else if (this.productKey) {
        this.productService.getItem(this.productKey).valueChanges().take(1)
          .subscribe(
            (value) => {
              this.product = value;
              this.getImageList(this.product['category'], false);
            })
      }
    } catch (error) {

    } finally {
      this.loader.hide();
    }
  }

  async onSubmit(productForm: NgForm) {
    try {
      this.loader.show();
      if (this.productKey) {
        await this.productService.updateItem(this.productKey, productForm.value)
        this.notificationMessage = "Updated successfully.";
        this._amDone(true); //emitter
      }
      else {
        await this.productService.addItem(productForm.value);
        this.notificationMessage = "Added successfully.";
        this._amDone(true); //emitter
      }

      this.resetProductForm(productForm);
      //this.router.navigate(['/products']);

    } catch (e) {
      this.notificationMessage = "Something went wrong.";
      //TODO: Need to check .. Currently could not catch exception
    } finally {
      this.loader.hide();
    }
  }

  //emitter
  public _amDone(data: boolean): void {
    this.amDone.emit(data);
  }

  resetProductForm(productForm: NgForm) {
    productForm.resetForm();
  }

  createOrUpdateCategory() {
    let categoryNameList = [];
    this.categoryList.filter(element => {
      categoryNameList.push(element.value.toLowerCase());
    });
    let slot = { 'key': 'Category', 'value': '', 'existingData': this.categoryList }
    let data = {
      'slot': slot,
      'canEdit': true,
      'isCategoryEntry': true,
      'matIcon': 'add_box',
      'label': 'Category'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    let categoryData: any;
    dialogRef.afterClosed().subscribe(result => {
      if (result != 'cancel') {
        let re = / /gi;
        let key = result.replace(re, "");
        categoryData = { 'key': key.toLowerCase(), 'value': result, 'active': true };
        this.categoryService.addItem(categoryData);
      }
    })
  }

  removeCategory() {
    let slot = { 'key': 'Category', 'value': '', 'existingData': this.categoryAllList }
    let data = {
      'slot': slot,
      'canEdit': true,
      'isCategoryRemove': true,
      'matIcon': 'block',
      'label': 'Category'
    };
    let dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result != 'cancel') {
        this.loader.show();
        let updatedData = JSON.parse(result);
        updatedData.forEach(element => {
          this.categoryService.updateItem(element.id, element);
        });
        this.loader.hide();
      }
    })
  }

  getImageList(_categoryKey: any, fromUI: boolean) {
    this.setCategoryValueByKey(_categoryKey);
    this.product['imageUrl'] = this.productKey && !fromUI ? this.product['imageUrl'] : '';
    try {
      this.loader.show();
      this.imageSubscription = this.imageService
        .getImageListByCategory(this.userId, _categoryKey).take(1).subscribe((value) => {
          this.imageList = [];
          value.forEach((img) => {
            Object.keys(img).length;
            this.imageList.push(img)
          });
        });
    } catch (error) {
    } finally {
      this.loader.hide();
    }

  }

  setCategoryValueByKey(_categoryKey: string): void {
    this.categoryAllList.find((cat) => {
      if (cat['key'] == _categoryKey)
        this.selectedCategoryValue = cat['value'];
    });
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }


}
