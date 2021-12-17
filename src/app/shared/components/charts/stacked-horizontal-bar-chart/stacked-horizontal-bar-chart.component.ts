import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { JsonHelper } from 'src/app/shared/models/common';

@Component({
  selector: 'app-stacked-horizontal-bar-chart',
  templateUrl: './stacked-horizontal-bar-chart.component.html',
  styleUrls: ['./stacked-horizontal-bar-chart.component.scss']
})
export class StackedHorizontalBarChartComponent implements OnInit, OnChanges {
  @Input('chartdata') chartdata: object = {};

  ProductStatsMode: any[] = this.chartdata['productStatsMode'];
  firstCopy = this.chartdata['firstCopy'];
  ProductDetailsDataset: any[];
  maxValue: number = 0;
  lineChartOptions: any;
  _lineChartColors: Array<any> = [{
    backgroundColor: 'red',
    borderColor: 'red',
    pointBackgroundColor: 'red',
    pointBorderColor: 'red',
    pointHoverBackgroundColor: 'red',
    pointHoverBorderColor: 'red'
  }];
  currentMonth: string;
  currentDate: string;

  constructor() { }

  ngOnInit(): void {
    this.ProductStatsMode = this.chartdata['productStatsMode'];
    this.ProductDetailsDataset = this.getProductDetailsDataSet(this.chartdata['productDetails']);
    this.maxValue = this.getMaxValue(this.chartdata['productDetails']);
    this.lineChartOptions = this.initialzeLineChartOptions(this.maxValue);
    var _date = new Date;
    this.currentDate = formatDate(_date, 'MM/dd/yyyy', 'en-US');
    this.currentMonth = JsonHelper.getMonth(this.currentDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ProductStatsMode = this.chartdata['productStatsMode'];
    this.ProductDetailsDataset = this.getProductDetailsDataSet(this.chartdata['productDetails']);
    this.maxValue = this.getMaxValue(this.chartdata['productDetails']);
    this.lineChartOptions = this.initialzeLineChartOptions(this.maxValue);
  }

  public ChartType = 'bar';
  public barChartLegend = true;

  public chartClicked(e: any): void {
    //console.log(e);
  }
  public chartHovered(e: any): void {
    //console.log(e);
  }

  initialzeLineChartOptions(maxValue: number): any {
    return {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            max: maxValue,
            min: 0,
          }
        }],
        xAxes: [{
        }],
      },
      plugins: {
        datalabels: {
          display: true,
          align: 'top',
          anchor: 'end',
          //color: "#2756B3",
          color: "#222",
          font: {
            family: 'FontAwesome',
            size: 14
          },
        },
        deferred: false
      },
    };
  }

  getProductDetailsDataSet(ProductDetails: any) {
    var arr: any[] = [];
    if (ProductDetails)
      ProductDetails.forEach(ele => {
        arr.push({
          'data': ele['productCounts'],
          'label': ele['productName']
        });
      });

    return arr;
  }

  getMaxValue(ProductDetails: any): number {
    var maxValue = 0;
    ProductDetails && ProductDetails.forEach(ele => {
      ele['productCounts'].forEach(n => {
        if (maxValue <= n)
          maxValue = n + 10;
      });
    });
    return maxValue;
  }
}


