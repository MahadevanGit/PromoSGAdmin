import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnChanges, OnInit, resolveForwardRef, SimpleChanges } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ProductService } from 'src/app/product/services/product.service';
import { ProductStatsService } from 'src/app/product/services/product.stats.service';
import { JsonHelper } from 'src/app/shared/models/common';
import { ProductChart, ProductChartDetails, ProductStats } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-stats',
  templateUrl: './product-stats.component.html',
  styleUrls: ['./product-stats.component.scss'],
  providers: [ProductStatsService, ProductService],
})
export class ProductStatsComponent implements OnInit, OnChanges {

  //dummy data
  data: object;
  // this.data  = {
  //   'productStatsMode': ["June","July","Aug","Sep"],
  //   'productDetails': [{
  //     'productName': "Moccho juice",
  //     'productCounts': [11,80,19,10]
  //   },
  //   {
  //     'productName': "Moccho coffee",
  //     'productCounts': [19,68,55,1]
  //   }
  // ],
  //   'firstCopy': false
  // }

  @Input('months') months: string[];
  chartData: ProductChart;
  productStats: ProductStats;
  productArr: any[];
  currentDate: string = '';
  logmonths: string[] = [];


  constructor(
    private loader: LoadingService,
    @Inject(LOCALE_ID) private local: string,
    private productStatsService: ProductStatsService,
    private productService: ProductService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getProducts();//check this 
    this.getTheChartData(this.months);
  }

  ngOnInit(): void {
    this.getProducts();
    this.getTheChartData(this.months);
  }

  getProducts() {
    try {
      this.loader.show();
      this.productService.getItemsByUserID().take(1).subscribe((products) => {
        this.productArr = products;
      });
    } catch (error) {
    } finally {
      this.loader.hide();
    }
  }


  getTheChartData(months: string[]) {
    let re = /,/gi;
    let productStatsArr: ProductStats[] = [];
    this.chartData = new ProductChart([], [], false);
    try {
      this.loader.show();
      this.productStatsService.getItemsByUserID().take(1).subscribe(
        (items) => {
          items.forEach((ps) => {
            for (let i = 1; i < Object.keys(ps).length; i++) {
              //to get key value => console.log(Object.values(Object.keys(ps)[i]).join().replace(re,''));
              //product stats object
              let productStatsObj = ps[Object.keys(ps)[i].valueOf()];
              for (let j = 0; j < Object.keys(productStatsObj).length; j++) {
                let pSo = productStatsObj[Object.keys(productStatsObj)[j].valueOf()];
                this.productStats = new ProductStats(pSo['productKey'], pSo['customerKey'], pSo['stats']);
                let _formatDate = formatDate(this.productStats.stats.purchaseDate, 'MM/dd/yyyy', 'en-US')
                this.logmonths.push(_formatDate)
                this.logmonths.push(JsonHelper.getMonth(_formatDate))
                this.productStats.purchaseMonth = JsonHelper.getMonth(_formatDate);
                this.productStats.qty = this.productStats.stats.qty;
                productStatsArr.push(
                  this.productStats
                );
              }
            }
            let groupByPurchaseMonth = JsonHelper.groupBy(productStatsArr, 'purchaseMonth');
            for (let j = 0; j < Object.keys(groupByPurchaseMonth).length; j++) {
              let pSo: ProductStats[] = groupByPurchaseMonth[Object.keys(groupByPurchaseMonth)[j].valueOf()];
              //If user not select the month from UI to view chart then system take current month
              var _date = new Date;
              this.currentDate = formatDate(_date, 'MM/dd/yyyy', 'en-US');
              if (months.length == 0) {
                let currentMonth = JsonHelper.getMonth(this.currentDate);
                months.push(currentMonth)
              }
              if (months.length > 0 && months.findIndex((s) => s == pSo[0].purchaseMonth) > -1) {
                this.getRequiredChartDetails(pSo);
              }
            }
            productStatsArr = [];
          });
          //convert chartdata product Id To product name
          this.convertIdToName()
          //assign chartdata value for app-stacked-horizontal-bar-chart component 
          this.data = this.chartData;
        });
    } catch (error) {
    } finally {
      this.loader.hide(500);
    }
  }

  convertIdToName() {
    this.chartData.productDetails.forEach((pd) => {
      this.productArr.forEach(
        (p) => {
          if (pd.productName === p.key)
            pd.productName = p.title;
        });
    })
  }

  getRequiredChartDetails(pSo: ProductStats[]) {
    var totalQtyByMonthAndProduct = (pSo.length > -1) && pSo.map(pro => pro.qty).reduce((a, pro) => pro + a); //a->accumulate //q->qty
    //push month
    if (!this.chartData.productStatsMode.find(x => x == pSo[0]['purchaseMonth']))
      this.chartData.productStatsMode.push(pSo[0]['purchaseMonth'])
    let productStatsModeIndex = this.chartData.productStatsMode.findIndex((i) => { return i == pSo[0]['purchaseMonth']; });
    //push productDetails
    let productChartDetails: ProductChartDetails = new ProductChartDetails('', []);
    productChartDetails.productName = pSo[0]['productKey'];
    productChartDetails.productCounts.push(totalQtyByMonthAndProduct ? totalQtyByMonthAndProduct : 0);
    if (this.chartData.productDetails.length > 0) {
      //find product already exist in the productDetails
      let productDetailsIndex = this.chartData.productDetails.findIndex((i) => { return i.productName == productChartDetails.productName; });
      //if product exist
      if (productDetailsIndex > -1) {
        if (productStatsModeIndex > 0) {
          let productCountsArr: number[] = [];
          let i = 0;
          //set 0 count for previous month
          while (i < productStatsModeIndex) {
            if (this.chartData.productDetails[productDetailsIndex].productCounts[i] > 0)
              productCountsArr.push(this.chartData.productDetails[productDetailsIndex].productCounts[i]);
            else
              productCountsArr.push(0);
            i++;
          }
          //push current month count
          productCountsArr.push(productChartDetails.productCounts[0])
          i++;
          //add if data exist after productStatsModeIndex in this this.chartData.productDetails[productDetailsIndex].productCounts arrya
          for (let index = i; index < this.chartData.productDetails[productDetailsIndex].productCounts.length; index++) {
            if (this.chartData.productDetails[productDetailsIndex].productCounts[index] > 0)
              productCountsArr.push(this.chartData.productDetails[productDetailsIndex].productCounts[index]);
            else
              productCountsArr.push(0);
            index++;
          }
          //assign the new counts array
          this.chartData.productDetails[productDetailsIndex].productCounts = productCountsArr;
        } else {
          this.chartData.productDetails[productDetailsIndex].productCounts[productStatsModeIndex] = productChartDetails.productCounts[0];
        }
      } else //if product not exist
      {
        if (productStatsModeIndex > 0) {
          let productCountsArr: number[] = [];
          let i = 0;
          //set 0 count for previous month
          while (i < productStatsModeIndex) {
            productCountsArr.push(0);
            i++;
          }
          //push current month count
          productCountsArr.push(productChartDetails.productCounts[0])
          //assign the new counts array
          productChartDetails.productCounts = productCountsArr;
        }
        else {
          console.log('If need then add code here...')
        }
        this.chartData.productDetails.push(productChartDetails)
      }
    }
    else {
      this.chartData.productDetails.push(productChartDetails);
    }
  }

}
