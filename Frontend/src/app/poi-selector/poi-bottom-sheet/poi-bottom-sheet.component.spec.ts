import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiBottomSheetComponent } from './poi-bottom-sheet.component';

describe('PoiBottomSheetComponent', () => {
  let component: PoiBottomSheetComponent;
  let fixture: ComponentFixture<PoiBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiBottomSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoiBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
