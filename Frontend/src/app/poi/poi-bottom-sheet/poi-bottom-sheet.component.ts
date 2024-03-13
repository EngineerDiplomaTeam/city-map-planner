import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { selectPoiOpenedInBottomSheet } from '../poi.selectors';

export type BottomSheetData = {
  id: number;
};

@Component({
  selector: 'app-poi-bottom-sheet',
  standalone: true,
  imports: [],
  templateUrl: './poi-bottom-sheet.component.html',
  styleUrl: './poi-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiBottomSheetComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly selectedPoi = this.store.selectSignal(
    selectPoiOpenedInBottomSheet,
  );

  protected readonly bottomRefSheet = inject(
    MatBottomSheetRef<PoiBottomSheetComponent, BottomSheetData>,
  );

  ngOnInit(): void {
    console.log(this.selectedPoi());
  }
}
