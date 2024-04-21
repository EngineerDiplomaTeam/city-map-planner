import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditPoiDialogComponent } from './add-or-edit-poi-dialog.component';

describe('AddOrEditPoiDialogComponent', () => {
  let component: AddOrEditPoiDialogComponent;
  let fixture: ComponentFixture<AddOrEditPoiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditPoiDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrEditPoiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
