import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'tc',
  templateUrl: './tc.component.html',
  styleUrls: ['./tc.component.scss']
})
export class TcComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() title: string = "Terms & Condition";

  get tcText() {
    return this.parentForm.get('tc.text');
  }
  get tcIsActive() {
    return this.parentForm.get('tc.isActive');
  }

  constructor() { }

  ngOnInit(): void {
  }

}
