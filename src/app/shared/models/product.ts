import { formatDate } from "@angular/common";
import { Inject } from "@angular/core";

export interface IProduct {
  title: string;
  category: string;
  price: string;
  imageUrl: string;
}

export interface IProductStatistics {
  productKey: string;
  customerKey: string;
  stats: IStats;
}
export interface IStats {
  purchaseDate: string;
  qty: number;
}

export class ProductStats implements IProductStatistics {
  public productKey: string;
  public customerKey: string;
  public stats: IStats;
  public purchaseMonth: string;
  public purchaseYear: string;
  public qty: number;


  constructor(_productKey, _customerKey, _stats) {
    this.productKey = _productKey;
    this.customerKey = _customerKey;
    this.stats = _stats;
  }

}

export interface IProductChart {
  productStatsMode: string[];
  productDetails: ProductChartDetails[];
  firstCopy: boolean;
}

export interface IProductChartDetails {
  productName: string;
  productCounts: number[];
}

export class ProductChartDetails implements IProductChartDetails {
  public productName: string;
  public productCounts: number[];

  constructor(_productName: string, _productCounts: number[]) {
    this.productName = _productName;
    this.productCounts = _productCounts;
  }

}

export class ProductChart implements IProductChart {

  public productStatsMode: string[];
  public productDetails: ProductChartDetails[];
  public firstCopy: boolean;

  constructor(_productStatsMode: string[], _productDetails: IProductChartDetails[], _firstCopy: boolean) {
    this.productStatsMode = _productStatsMode;
    this.productDetails = _productDetails;
    this.firstCopy = _firstCopy;
  }

}