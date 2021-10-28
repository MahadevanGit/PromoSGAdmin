import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCardDashboardComponent } from './promo-card-dashboard.component';

describe('PromoCardDashboardComponent', () => {
  let component: PromoCardDashboardComponent;
  let fixture: ComponentFixture<PromoCardDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoCardDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoCardDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
