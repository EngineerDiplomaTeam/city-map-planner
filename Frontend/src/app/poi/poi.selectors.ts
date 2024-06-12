import { createFeatureSelector, createSelector } from '@ngrx/store';
import { POI_FEATURE_KEY, PoiState } from './poi.reducer';
import { OlMapMarker } from '../open-layers-map/ol-map-marker-manager.service';
import { state } from '@angular/animations';

export const selectPoiState = createFeatureSelector<PoiState>(POI_FEATURE_KEY);

export const selectPoiOpenedInBottomSheet = createSelector(
  selectPoiState,
  (state) =>
    state.pointsOfInterest.find((x) => x.id === state.poiInBottomSheetId),
);

export const selectAllPois = createSelector(
  selectPoiState,
  (state) => state.pointsOfInterest,
);


export const selectOlMarkers = createSelector(selectAllPois, (s) =>
  s.map(
    ({ id, map: { iconSrc, label, lon, lat } }): OlMapMarker => ({
      id,
      iconSrc,
      lat,
      lon,
      label,
    }),
  ),
);

export const selectPoiIdsInBasket = createSelector(
  selectPoiState,
  (state) => state.poisInBasket,
);

export const selectPoisInBasket = createSelector(
  selectAllPois,
  selectPoiIdsInBasket,
  (pois, ids) => pois.filter((x) => ids.includes(x.id)),
);

export const selectAllPoisIsBacket = createSelector(
  selectAllPois,
  selectPoiIdsInBasket,
  (allPois, selectPoiIdsInBasket) => {
    return allPois.map((x) => ({
      ...x,
      isInBasket: selectPoiIdsInBasket.includes(x.id),
    }));
  },
);
export const selectPoiInBasketCount = createSelector(
  selectPoiIdsInBasket,
  (ids) => ids.length,
);

export const selectBaskedDialogId = createSelector(
  selectPoiState,
  (state) => state.baskedDialogId,
);
