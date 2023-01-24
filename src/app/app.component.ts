import { Component, OnInit } from '@angular/core';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public loader: LoadingService) { }
  title = 'PromoSGAdmin';
  loading$ = this.loader.loading$;
  imgSrc: string = 'assets/images/ai_icon1.png';
  version = "";
  ngOnInit(){
    this.setVersion();
  }

  setVersion() {
    if (typeof (window.PRSGA_VERSION) === 'string' && window.PRSGA_VERSION != '' && window.PRSGA_VERSION != undefined) {
      this.version = window.PRSGA_VERSION;
    }
    else {
      this.version = "1.100";
    }
  }

}
