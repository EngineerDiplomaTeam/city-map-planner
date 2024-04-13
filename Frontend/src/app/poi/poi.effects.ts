import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PoiService } from './poi.service';
import { poiActions } from './poi.actions';
import {
  exhaustMap,
  map,
  mergeMap,
  of,
  switchMap,
  switchMapTo,
  withLatestFrom,
} from 'rxjs';
import {
  BottomSheetData,
  PoiBottomSheetComponent,
} from './poi-bottom-sheet/poi-bottom-sheet.component';
import { authActions } from '../auth/auth.actions';
import { AuthDialogComponent } from '../auth/auth-dialog/auth-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PoiBasketDialogComponent } from './poi-basket-dialog/poi-basket-dialog.component';
import {
  selectBaskedDialogId,
  selectPoiIdsInBasket,
  selectPoiInBasketCount,
} from './poi.selectors';
import { noopAction } from '../noop-action';

@Injectable()
export class PoiEffects {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly actions$ = inject(Actions);
  private readonly matBottomSheet = inject(MatBottomSheet);
  private readonly poiService = inject(PoiService);

  public readonly poiMarkerClick$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(poiActions.mapMarkerClicked),
      map(({ markerId }) => poiActions.openBottomSheet({ poiId: markerId })),
    );
  });

  public readonly openBottomSheet$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(poiActions.openBottomSheet),
      exhaustMap(async () =>
        this.matBottomSheet.open<PoiBottomSheetComponent, BottomSheetData>(
          PoiBottomSheetComponent,
        ),
      ),
      switchMap((ref) => ref.afterDismissed()),
      map(() => poiActions.bottomSheetClosed()),
    );
  });

  public readonly loadPois$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(poiActions.loadPois),
      exhaustMap(() => this.poiService.listPois()),
      map((pois) => poiActions.poisLoaded({ pois })),
    );
  });

  public readonly openBasket$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(poiActions.openBasked),
      exhaustMap(
        async () =>
          this.dialog.open(PoiBasketDialogComponent, {
            // width: '90svw',
            // height: '70svh',
            // disableClose: true,
          }).id,
      ),
      map((id) => poiActions.baskedDialogOpened({ id })),
    );
  });

  public readonly closeBasketWhenNoItemsInside$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(poiActions.removeFromBasket),
      switchMap(() => this.store.select(selectPoiInBasketCount)),
      map((poisCount) => {
        if (poisCount <= 0) {
          return poiActions.closeBasked();
        }

        return noopAction();
      }),
    );
  });

  // public readonly closeBasket$ = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(poiActions.closeBasked),
  //       switchMap(() => this.store.select(selectBaskedDialogId)),
  //       map((id) => this.dialog.getDialogById(id!)?.close()),
  //     );
  //   },
  //   { dispatch: false },
  // );
}
