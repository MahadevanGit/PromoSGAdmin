import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CategoryService } from 'src/app/product/services/category.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { MasterContentService } from 'src/app/shared/services/master-content.service';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  providers: [CategoryService, ImageService, MasterContentService, AuthService]
})
export class ImageUploadComponent implements OnInit, OnDestroy {

  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean = false;
  auth_subscription: Subscription;
  isAdmin: boolean = false;
  userId: string;
  categoryList: any[] = [];

  @Input('imageRequestType') imageRequestType: string;
  @Input('rootPath') rootPath: string;
  // @Input('imageListRoutePath') imageListRoutePath: string;

  formTemplate = new FormGroup({
    caption: new FormControl('', Validators.required),
    category: new FormControl(''),
    imageUrl: new FormControl('', Validators.required)
  })
  categorySubscription: Subscription;

  constructor(
    private loader: LoadingService,
    private storage: AngularFireStorage,
    private imgService: ImageService,
    private auth: AuthService,
    private categoryService: CategoryService,
    private masterService: MasterContentService) {
  }

  ngOnInit() {
    this.resetForm();
    this.auth_subscription = this.auth.appUser$.subscribe(_user => {
      this.isAdmin = _user.isAdmin;
      this.userId = _user.userId;
      this.getCategoryList();
    });
  }

  getCategoryList() {
    try {
      this.loader.show();
      this.categorySubscription = this.imageRequestType == 'product' && this.categoryService
        .getItemsWithMap(this.userId).subscribe((value) => {
          this.categoryList = [];
          value.forEach((cat) => {
            if (cat['active'] == true)
              this.categoryList.push(cat);
          });
        });

      this.categorySubscription = this.imageRequestType == 'usersetting' && this.masterService
        .getItemsWithMap().subscribe((value) => {
          this.categoryList = [];
          value.forEach((cat) => {
            if (cat['active'] == true)
              this.categoryList.push(cat);
          });
        });
    } catch (error) {

    } finally {
      this.loader.hide(500);
    }
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = 'assets/images/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }

  onSubmit(formValue) {
    try {
      this.isSubmitted = true;
      if (this.formTemplate.valid) {
        this.loader.show();
        var rootPath = this.rootPath.replace('current-user-id', this.userId);
        rootPath = `${rootPath}${formValue.category}`;
        var filePath = rootPath + `/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);
        this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              formValue['imageUrl'] = url;
              this.imgService.insertImageDetails(rootPath, formValue);
              this.resetForm();
            })
          })
        ).subscribe();
      }
    } catch (error) {
    } finally {
      this.loader.hide();
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption: '',
      imageUrl: '',
      category: ''
    });
    this.imgSrc = 'assets/images/image_placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
  }

  ngOnDestroy(): void {
    this.auth_subscription.unsubscribe();
    // this.categorySubscription.unsubscribe();
  }

}
