import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGalleryListComponent } from './image-gallery-list.component';

describe('ImageGalleryListComponent', () => {
  let component: ImageGalleryListComponent;
  let fixture: ComponentFixture<ImageGalleryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageGalleryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageGalleryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
