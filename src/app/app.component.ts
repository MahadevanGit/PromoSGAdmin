import { Component } from '@angular/core';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public loader: LoadingService) { }
  title = 'PromoSGAdmin';
  loading$ = this.loader.loading$;
  imgSrc: string = 'assets/images/ai_icon1.png';
}
