import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemTitle,
  MatListItemMeta,
  MatListSubheaderCssMatStyler,
} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import {
  MatFabButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { Store } from '@ngrx/store';
import { selectAllPoisIsBacket } from '../poi/poi.selectors';
import { poiActions } from '../poi/poi.actions';
import { FindImageWithIconPipe } from '../poi-manage/find-image-with-icon.pipe';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { RequireUpdatePipe } from '../poi-manage/require-update.pipe';
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
  protected readonly store = inject(Store);
  ngOnInit() {
    this.store.dispatch(poiActions.loadPois());
  }

  vm$ = this.store.select(selectAllPoisIsBacket);

  protected readonly poiActions = poiActions;

  public toggleInBasket(poiIdx: number): void {
    this.store.dispatch(
      poiActions.changeBasket({
        poiId: poiIdx,
      }),
    );
  }
}
