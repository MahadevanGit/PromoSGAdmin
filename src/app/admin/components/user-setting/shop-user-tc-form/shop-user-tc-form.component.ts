import { Component, Input, OnInit } from '@angular/core';
import { ShopUser } from 'src/app/shared/models/shop';

@Component({
  selector: 'shop-user-tc-form',
  templateUrl: './shop-user-tc-form.component.html',
  styleUrls: ['./shop-user-tc-form.component.scss']
})
export class ShopUserTcFormComponent implements OnInit {

  @Input("shopUser") shopUser: ShopUser;

  constructor() { }

  ngOnInit(): void {
  }

}
