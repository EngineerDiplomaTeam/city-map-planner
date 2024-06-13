import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import {
  selectPoiIdsInBasket,
  selectPoiOpenedInBottomSheet,
} from '../poi.selectors';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { poiActions } from '../poi.actions';
import { NgForOf } from '@angular/common';
import { WeatherIconsService } from '../../weather-icons/weather-icons-service';

export type BottomSheetData = {
  id: number;
};

@Component({
  selector: 'app-poi-bottom-sheet',
  standalone: true,
  imports: [MatButton, MatFabButton, MatIconModule, NgForOf],
  templateUrl: './poi-bottom-sheet.component.html',
  styleUrl: './poi-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiBottomSheetComponent {
  private readonly store = inject(Store);
  protected readonly weatherIconService = inject(WeatherIconsService);
  protected readonly selectedPoi = this.store.selectSignal(
    selectPoiOpenedInBottomSheet,
  );

  protected readonly poiIdsInBasket =
    this.store.selectSignal(selectPoiIdsInBasket);

  protected readonly isInBasket = computed(() =>
    this.selectedPoi()
      ? this.poiIdsInBasket().includes(this.selectedPoi()!.id)
      : false,
  );

  protected readonly bottomRefSheet = inject(
    MatBottomSheetRef<PoiBottomSheetComponent, BottomSheetData>,
  );

  public toggleInBasket(): void {
    if (this.isInBasket()) {
      this.store.dispatch(
        poiActions.removeFromBasket({
          poiId: this.selectedPoi()!.id,
        }),
      );
    } else {
      this.store.dispatch(
        poiActions.addToBasket({
          poiId: this.selectedPoi()!.id,
        }),
      );
    }
  }
}
