import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiSelectorComponent } from './poi-selector.component';
import { provideMockStore } from '@ngrx/store/testing';
import { selectPoiMarkers } from '../poi.selectors';

describe('PoiSelectorComponent', () => {
  let component: PoiSelectorComponent;
  let fixture: ComponentFixture<PoiSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoiSelectorComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectPoiMarkers,
              value: [],
            },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(PoiSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
