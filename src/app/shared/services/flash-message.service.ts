import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FlashMessageType } from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {

  
  action: boolean = true;
  setAutoHide: boolean = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  addExtraClass: boolean = true;
  actionButtonLabel: string = 'close';
  duration: number = 3000;
  constructor(private _snackBar: MatSnackBar) {
  }

  error(message: string) {
    this.open(message,FlashMessageType.danger,1000000);
  }

  success(message: string) {
    this.open(message,FlashMessageType.success);
  }

  info(message: string) {
    this.open(message,FlashMessageType.info,5000);
  }

  warn(message: string) {
    this.open(message,FlashMessageType.warning,5000);
  }


  private open(message: string, type: FlashMessageType, _duration?: number) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide && !_duration ? this.duration : _duration;
    config.panelClass = this.addExtraClass ? [type.toString()] : undefined;
    this._snackBar.open(message, this.action ? this.actionButtonLabel : undefined, config);
  }

}
