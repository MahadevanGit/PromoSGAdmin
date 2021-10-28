import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageMember } from '../../models/common';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-gallery-list',
  templateUrl: './image-gallery-list.component.html',
  styleUrls: ['./image-gallery-list.component.scss']
})
export class ImageGalleryListComponent implements OnInit {
  
  imageList: any[];
  imageSubscription: Subscription;
  userId: string;
  isAdmin: boolean = false;
  localStorageMember = new LocalStorageMember();
  auth_subscription: Subscription;
  shopUserId: string;
  @Input('imageFolderName') imageFolderName: string;

  constructor(
    private imageService: ImageService,
    private auth: AuthService,
    private route: ActivatedRoute) {
      this.shopUserId = this.route.snapshot.paramMap.get('userId'); // for promoSG admin user
      console.log(this.shopUserId)
      this.auth_subscription = this.auth.appUser$.subscribe(_user=> { 
        this.isAdmin = _user.isAdmin;
      });
     }
  

  ngOnInit(): void {
    this.userId = this.localStorageMember.get(this.localStorageMember.userId);
    this.getImageList();
  }

  getImageList() {
    this.imageSubscription = this.imageService
    .getAll(this.shopUserId ? this.shopUserId : this.userId,this.imageFolderName).subscribe((value)=>{
      this.imageList = [];
      value.forEach((img) => {
        Object.keys(img).length;
        for (let i = 0; i < Object.keys(img).length; i++) {
          this.imageList.push(img[Object.keys(img)[i]]);
        }
        });
    });
  }

  ngOnDestroy(): void {
    this.imageSubscription.unsubscribe();
    this.auth_subscription.unsubscribe();
  }


}
