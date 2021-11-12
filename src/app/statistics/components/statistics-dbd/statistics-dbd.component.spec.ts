import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsDbdComponent } from './statistics-dbd.component';

describe('StatisticsDbdComponent', () => {
  let component: StatisticsDbdComponent;
  let fixture: ComponentFixture<StatisticsDbdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsDbdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsDbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
