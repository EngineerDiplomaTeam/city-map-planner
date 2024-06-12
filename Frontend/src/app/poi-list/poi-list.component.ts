import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject, OnInit,
} from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemMeta,
  MatListItemTitle,
  MatListSubheaderCssMatStyler,
} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import {
  MatFabButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { Store } from '@ngrx/store';
import { selectAllPois, selectPoiIdsInBasket } from '../poi/poi.selectors';
import { poiActions } from '../poi/poi.actions';
import { FindImageWithIconPipe } from '../poi-manage/find-image-with-icon.pipe';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { RequireUpdatePipe } from '../poi-manage/require-update.pipe';
import { Observable } from 'rxjs';
import { PointOfInterest } from '../poi/poi.reducer';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-poi-list',
  standalone: true,
  imports: [
    MatProgressBar,
    MatList,
    MatListSubheaderCssMatStyler,
    MatIcon,
    MatMiniFabButton,
    FindImageWithIconPipe,
    MatDivider,
    MatIconButton,
    MatListItem,
    MatListItemAvatar,
    MatListItemMeta,
    MatListItemTitle,
    MatTooltip,
    RequireUpdatePipe,
    AsyncPipe,
    NgForOf,
    MatFabButton,
  ],
  templateUrl: './poi-list.component.html',
  styleUrl: './poi-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiListComponent implements OnInit {
  pois$: Observable<PointOfInterest[]>;

  ngOnInit() {
    this.store.dispatch(poiActions.loadPois());
  }
  protected readonly store = inject(Store);
  constructor() {
    this.pois$ = this.store.select(selectAllPois);
  }

  protected readonly poiIdsInBasket =
    this.store.selectSignal(selectPoiIdsInBasket);

  protected isInBasket = (poiIdx: number) =>
    computed(() => this.poiIdsInBasket().includes(poiIdx));
  public toggleInBasket(poiIdx: number): void {
    if (!this.isInBasket(poiIdx)) {
      this.store.dispatch(
        poiActions.removeFromBasket({
          poiId: poiIdx,
        }),
      );
    } else {
      this.store.dispatch(
        poiActions.addToBasket({
          poiId: poiIdx,
        }),
      );
    }
  }

  protected readonly poiActions = poiActions;
}
