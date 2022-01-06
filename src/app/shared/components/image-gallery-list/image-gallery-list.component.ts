import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ShopUser } from '../../models/shop';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'image-gallery-list',
  templateUrl: './image-gallery-list.component.html',
  styleUrls: ['./image-gallery-list.component.scss'],
  providers: [ImageService]
})
export class ImageGalleryListComponent implements OnInit {

  imageList: any[];
  imageSubscription: Subscription;
  userId: string;
  shopUserId: string;
  
  @Input('imageFolderName') imageFolderName: string;
  @Input("shopUser") shopUser: ShopUser;

  constructor(
    private loader: LoadingService,
    private imageService: ImageService,
    private route: ActivatedRoute) {
    this.shopUserId = this.route.snapshot.paramMap.get('userId'); // for promoSG admin user
    // this.auth_subscription = this.auth.appUser$.subscribe(_user => {
    //   this.isAdmin = _user.isAdmin;
    // });
  }


  ngOnInit(): void {
    this.userId = this.shopUser.userId
    this.getImageList();
  }

  getImageList() {
    try {
      this.loader.show();
      this.imageSubscription = this.imageService
        .getAll(this.imageFolderName,this.shopUserId ? this.shopUserId : this.userId).subscribe((value) => {
          this.imageList = [];
          value.forEach((img) => {
            Object.keys(img).length;
            for (let i = 0; i < Object.keys(img).length; i++) {
              this.imageList.push(img[Object.keys(img)[i]]);
            }
            console.log(this.imageList);
          });
        });
    } catch (error) {

    } finally {
      this.loader.hide();
    }

  }

  ngOnDestroy(): void {
    this.imageSubscription.unsubscribe();
    // this.auth_subscription.unsubscribe();
  }


}
