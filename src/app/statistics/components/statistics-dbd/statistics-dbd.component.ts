import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JsonHelper } from 'src/app/shared/models/common';

@Component({
  selector: 'app-statistics-dbd',
  templateUrl: './statistics-dbd.component.html',
  styleUrls: ['./statistics-dbd.component.scss']
})
export class StatisticsDbdComponent implements OnInit {

  months: string[] = [];
  monthsArr: string[] = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  defaultSelection: string[] = [];
  currentDate: string;

  constructor() { }

  ngOnInit(): void {
    var d = new Date;
    this.currentDate = formatDate(d,'MM/dd/yyyy','en-US');
    console.log(this.currentDate)
    let currentMonth = JsonHelper.getMonth(this.currentDate);
    this.defaultSelection.push(currentMonth);
  }

  public GetSelectedValues(data: any):void {
    //tested .. moth valus is coming here
    this.months = data == null ? [] : data;
  }

}
