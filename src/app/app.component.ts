import { Component } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public loader: LoadingService) { }

  title = 'PromoSGAdmin';
  loading$ = this.loader.loading$;

}
