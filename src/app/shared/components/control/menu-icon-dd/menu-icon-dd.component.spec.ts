import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuIconDdComponent } from './menu-icon-dd.component';

describe('MenuIconDdComponent', () => {
  let component: MenuIconDdComponent;
  let fixture: ComponentFixture<MenuIconDdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuIconDdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuIconDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
