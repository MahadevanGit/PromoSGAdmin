import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedHorizontalBarChartComponent } from './stacked-horizontal-bar-chart.component';

describe('StackedHorizontalBarChartComponent', () => {
  let component: StackedHorizontalBarChartComponent;
  let fixture: ComponentFixture<StackedHorizontalBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedHorizontalBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedHorizontalBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
