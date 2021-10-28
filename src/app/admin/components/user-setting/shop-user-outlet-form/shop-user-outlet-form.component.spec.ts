import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopUserOutletFormComponent } from './shop-user-outlet-form.component';

describe('ShopUserOutletFormComponent', () => {
  let component: ShopUserOutletFormComponent;
  let fixture: ComponentFixture<ShopUserOutletFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopUserOutletFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopUserOutletFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
