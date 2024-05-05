import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiSightseeingDaysManageDialogComponent } from './poi-sightseeing-days-manage-dialog.component';

describe('PoiSightseeingDaysManageDialogComponent', () => {
  let component: PoiSightseeingDaysManageDialogComponent;
  let fixture: ComponentFixture<PoiSightseeingDaysManageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiSightseeingDaysManageDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoiSightseeingDaysManageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
