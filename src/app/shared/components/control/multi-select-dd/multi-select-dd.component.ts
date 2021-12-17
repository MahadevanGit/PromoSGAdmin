import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multi-select-dd',
  templateUrl: './multi-select-dd.component.html',
  styleUrls: ['./multi-select-dd.component.scss']
})
export class MultiSelectDdComponent implements OnInit {

  multiSelectDD = new FormControl();

  @Input('values') monthsArr: string[];
  @Input('defaultSelection') defaultSelection: string[];
  @Output() onAfterSelect = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.multiSelectDD.setValue(this.defaultSelection);
    this.getSelectedMonth(this.multiSelectDD.value);
  }

  public getSelectedMonth(data): void {
    this.onAfterSelect.emit(data);
  }

  onChange() {
    this.getSelectedMonth(this.multiSelectDD.value);
  }

}
