import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCardFormComponent } from './promo-card-form.component';

describe('PromoCardFormComponent', () => {
  let component: PromoCardFormComponent;
  let fixture: ComponentFixture<PromoCardFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoCardFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
