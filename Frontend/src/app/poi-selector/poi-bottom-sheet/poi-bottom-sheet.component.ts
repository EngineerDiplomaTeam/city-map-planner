import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

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
  protected readonly bottomRefSheet = inject(
    MatBottomSheetRef<PoiBottomSheetComponent, BottomSheetData>,
  );

  protected readonly data: BottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);

  ngOnInit(): void {
    console.log(this.data);
  }
}
