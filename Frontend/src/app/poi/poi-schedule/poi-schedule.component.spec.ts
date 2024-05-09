import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiScheduleComponent } from './poi-schedule.component';
import { provideMockStore } from '@ngrx/store/testing';
import { selectPoisInBasket } from '../poi.selectors';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

describe('PoiScheduleComponent', () => {
  let component: PoiScheduleComponent;
  let fixture: ComponentFixture<PoiScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiScheduleComponent],
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

    fixture = TestBed.createComponent(PoiScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
