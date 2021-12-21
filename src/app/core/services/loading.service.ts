import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable().pipe(delay(1));

  constructor() {
  }

  show() {
    this._loading.next(true);
  }

  async hide(ms?: number) {
    let _ms = ms ? ms : 1000;
    await this.delay(_ms);
    this._loading.next(false);
  }

  private delay(ms: number): Promise<any> {
    const dummyObservable = of();
    return dummyObservable.pipe(delay(ms)).toPromise();
  }

}
