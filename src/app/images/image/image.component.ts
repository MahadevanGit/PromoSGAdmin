import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CategoryService } from 'src/app/product/services/category.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ImageService } from 'src/app/shared/services/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  providers:[CategoryService]
})
export class ImageComponent implements OnInit,OnDestroy {

  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean = false;
  auth_subscription: Subscription;
  isAdmin: boolean = false;
  userId: string;
  categoryList: any[] = [];

  formTemplate = new FormGroup({
    caption: new FormControl('', Validators.required),
    category: new FormControl(''),
    imageUrl: new FormControl('', Validators.required)
  })
  categorySubscription: Subscription;

  constructor(
    private storage: AngularFireStorage, 
    private imgService: ImageService,
    private auth: AuthService,
    private categoryService: CategoryService) { 
      this.auth_subscription = this.auth.appUser$.subscribe(_user=> { 
        this.isAdmin = _user.isAdmin;
        this.userId = _user.userId; 

        this.categorySubscription = this.categoryService
        .getItemsWithMap(this.userId).subscribe((value)=>{
          this.categoryList = [];
          value.forEach((cat) => {
            if(cat['active']==true) 
            this.categoryList.push(cat);});
        });
      
      });
        
        
  }

  ngOnInit() {
    this.resetForm();
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
    console.log('onsubmit called')
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var rootPath = `shop-user-content/${this.userId}/product-imageDetails/${formValue.category}`;
      var filePath = rootPath + `/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            this.imgService.insertImageDetails(rootPath,formValue);
            this.resetForm();
          })
        })
      ).subscribe();
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
    this.categorySubscription.unsubscribe();
  }


}
