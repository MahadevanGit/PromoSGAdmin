import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/loading.service';

@Component({
  selector: 'admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.scss']
})
export class AdminSettingComponent implements OnInit {

  constructor(private loader: LoadingService,) { }

  ngOnInit(): void {
  }

}
