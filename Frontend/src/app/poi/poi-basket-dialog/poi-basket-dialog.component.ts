import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { selectPoisInBasket } from '../poi.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { poiActions } from '../poi.actions';
import { RouterLink } from '@angular/router';
import { MatDialogClose } from '@angular/material/dialog';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeRangePickerComponent } from '../../time-range-picker/time-range-picker.component';
import { ToUrlPipe } from '../to-url.pipe';
import { ToHeightPipe } from '../to-height.pipe';
import { ToDurationPipe } from '../to-duration.pipe';

@Component({
  selector: 'app-poi-basket-dialog',
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatDialogClose,
    MatFormFieldModule,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TimeRangePickerComponent,
    ToUrlPipe,
    ToHeightPipe,
    ToDurationPipe,
  ],
  templateUrl: './poi-basket-dialog.component.html',
  styleUrl: './poi-basket-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiBasketDialogComponent {
  protected readonly store = inject(Store);
  protected readonly poisInBasket = this.store.selectSignal(selectPoisInBasket);
  protected readonly poiActions = poiActions;
}
