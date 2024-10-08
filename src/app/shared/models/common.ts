import { DatePipe, formatDate } from "@angular/common";

export interface Result {
  success: boolean,
  message: string;
}
export class LocalStorageMember {

  //Register variable here
  static returnUrl: string = 'returnUrl';
  static userId: string = 'userId';

  //Add localStorage variable value
  static add(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  //Get localStorage variable value
  static get(key: string): string {
    return localStorage.getItem(key);
  }

  //Clear registered variable here
  static clear() {
    localStorage.removeItem(this.returnUrl);
    localStorage.removeItem(this.userId);
  }
  
}

export class JsonHelper {

  /**
   * 
   * @param xs pass json object
   * @param key pass key of object to gruop by
   * @example jsonObject = [ {team: "TeamA",name: "Ahmed",field3:"val3"}, {team: "TeamB",name: "Ahmed",field3:"val43"}, {team: "TeamA",name: "Ahmed",field3:"val55"} ]; var groubedByTeam= groupBy(jsonObject, 'team'); console.log(groubedByTeam);
   * @returns array of values by key
   */
  static groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  /**
   * 
   * @param date pass _date.toLocaleString()
   * @example var _date = new Date; _date.toLocaleString(); ex: 10/26/2021, 4:11:08 PM
   * @returns Oct for "10/26/2021, 4:11:08 PM"
   */
  static getMonth(date: string) {
    return new Date(formatDate(date, 'MM/dd/yyyy', 'en-US')).toLocaleString('en-US', { month: 'short' });
  }

  /**
   * 
   * @param date pass _date.toLocaleString()
   * @example var _date = new Date; _date.toLocaleString(); ex: 10/26/2021, 4:11:08 PM
   * @returns 2021 for "10/26/2021, 4:11:08 PM"
   */
  static getYear(date: string) {
    return new Date(formatDate(date, 'MM/dd/yyyy', 'en-US')).toLocaleString('en-US', { year: 'numeric' });
  }

  /**
   * 
   * @param date pass _date.toLocaleString() 
   * @param format pass 'MM/dd/yyyy'
   * @example var _date = new Date; _date.toLocaleString(); ex: 26/10/2021, 4:11:08 PM
   * @returns "10/26/2021"
   */
  static getDate(date: string, format: string) {
    return new Date(formatDate(date.toLocaleString(), format, 'en-US')).toLocaleString();
  }

  static getLimitedChar(value: string,limit: number): string{
    return value && value.length > limit ? value.substring(0,limit) + '..' : value;
  }

  static getFormattedDate(value: Date, format: string){
    const datepipe: DatePipe = new DatePipe('en-US')
    let formattedDate = datepipe.transform(value, format);
    return formattedDate;
  }
}

export class MatMenuListItem {
  menuLinkText: string;
  menuLinkKey: string;
  menuIcon: string;
  isDisabled: boolean;
  selected: boolean;
}

export enum FlashMessageType {
  success = "success", 
  info = "info", 
  warning = "warning", 
  danger = "danger"
}

export enum ImageCategory {
  profilelogo = "profileLogo", 
  shoplogo = "shopLogo"
}

export enum ImageDetailsFolder {
  product = "product-imageDetails", 
  usersetting = "usersetting-imageDetails"
}



