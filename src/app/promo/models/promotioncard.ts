import { KeyValue } from '@angular/common';

export interface IPromotionCard {
    key: string;
    title: string;
    slots: number;
    //column: number;
    promopoint: number;
    startDate: Date;
    expiryDate: Date;
    promoGrid: KeyValue<string,KeyValue<string,string>>[];
    isActive: boolean;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    verifiedBy: string;
    verifiedDate: string;
    publishedBy: string;
    publishedDate: string;
    status: string; //In-progress,Published
  }