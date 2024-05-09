import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiSightseeingDaysManageDialogComponent } from './poi-sightseeing-days-manage-dialog.component';
import { MockProvider } from 'ng-mocks';
import { MatDialogRef } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { EMPTY } from 'rxjs';

describe('PoiSightseeingDaysManageDialogComponent', () => {
  let component: PoiSightseeingDaysManageDialogComponent;
  let fixture: ComponentFixture<PoiSightseeingDaysManageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiSightseeingDaysManageDialogComponent],
      providers: [
        MockProvider(MatDialogRef, {
          beforeClosed: () => EMPTY,
        }),
        provideNativeDateAdapter(),
        MockProvider(DIALOG_DATA, {
          sightseeingTimeSpans: [],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PoiSightseeingDaysManageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
