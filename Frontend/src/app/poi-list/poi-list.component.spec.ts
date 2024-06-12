import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiListComponent } from './poi-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { selectAllPois, selectAllPoisIsBacket } from '../poi/poi.selectors';
import { MockProviders } from 'ng-mocks';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

describe('PoiListComponent', () => {
  let component: PoiListComponent;
  let fixture: ComponentFixture<PoiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiListComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectAllPois,
              value: {},
            },
            {
              selector: selectAllPoisIsBacket,
              value: [],
            },
          ],
        }),
        MockProviders(MatBottomSheetRef),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PoiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
