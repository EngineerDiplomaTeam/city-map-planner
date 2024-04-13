import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { selectPoisInBasket } from '../poi.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { poiActions } from '../poi.actions';
import { RouterLink } from '@angular/router';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-poi-basket-dialog',
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatDialogClose,
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
