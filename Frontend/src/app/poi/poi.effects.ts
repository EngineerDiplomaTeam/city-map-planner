import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PoiService } from './poi.service';
import { poiActions } from './poi.actions';
import { exhaustMap, map, switchMap } from 'rxjs';
import {
  BottomSheetData,
  PoiBottomSheetComponent,
} from './poi-bottom-sheet/poi-bottom-sheet.component';

@Injectable()
export class PoiEffects {
  private readonly store = inject(Store);
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
}
