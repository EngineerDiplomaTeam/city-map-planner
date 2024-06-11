import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiBasketDialogComponent } from './poi-basket-dialog.component';
import { provideMockStore } from '@ngrx/store/testing';
import { selectPoisInBasket } from '../poi.selectors';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

describe('PoiBasketDialogComponent', () => {
  let component: PoiBasketDialogComponent;
  let fixture: ComponentFixture<PoiBasketDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiBasketDialogComponent],
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

    fixture = TestBed.createComponent(PoiBasketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
