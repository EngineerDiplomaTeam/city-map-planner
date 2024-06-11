import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiSummaryComponent } from './poi-summary.component';
import { provideMockStore } from '@ngrx/store/testing';
import { selectPoisInBasket } from '../poi.selectors';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

describe('PoiSummaryComponent', () => {
  let component: PoiSummaryComponent;
  let fixture: ComponentFixture<PoiSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiSummaryComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectPoisInBasket,
              value: [],
            },
          ],
        }),
        MockProvider(ActivatedRoute),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PoiSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
