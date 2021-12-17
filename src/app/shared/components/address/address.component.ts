import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() title: string = "Address";

  get addressBlock() {
    return this.parentForm.get('address.block');
  }
  get addressStreet() {
    return this.parentForm.get('address.street');
  }
  get addressCity() {
    return this.parentForm.get('address.city');
  }
  get addressZip() {
    return this.parentForm.get('address.zip');
  }

  constructor() { }

  ngOnInit(): void {
  }

}
