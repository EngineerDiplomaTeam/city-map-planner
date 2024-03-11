import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiBottomSheetComponent } from './poi-bottom-sheet.component';
import { MockProviders } from 'ng-mocks';
import { provideMockStore } from '@ngrx/store/testing';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { selectPoiOpenedInBottomSheet } from '../poi.selectors';

describe('PoiBottomSheetComponent', () => {
  let component: PoiBottomSheetComponent;
  let fixture: ComponentFixture<PoiBottomSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoiBottomSheetComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectPoiOpenedInBottomSheet,
              value: {},
            },
          ],
        }),
        MockProviders(MatBottomSheetRef),
      ],
    });

    fixture = TestBed.createComponent(PoiBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
