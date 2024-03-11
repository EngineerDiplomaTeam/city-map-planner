import { createFeatureSelector, createSelector } from '@ngrx/store';
import { POI_FEATURE_KEY, PoiState } from './poi.reducer';
import { OlMapMarker } from '../open-layers-map/ol-map-marker-manager.service';

const selectPoiState = createFeatureSelector<PoiState>(POI_FEATURE_KEY);

export const selectPoiIdOpenedInBottomSheet = createSelector(
  selectPoiState,
  (state) => state.poiInBottomSheetId,
);

export const selectPoiMarkers = createSelector(selectPoiState, (state) =>
  state.pointsOfInterest.map(
    ({ id, map: { iconSrc, label, lon, lat } }): OlMapMarker => ({
      id,
      iconSrc,
      lat,
      lon,
      label,
    }),
  ),
);
