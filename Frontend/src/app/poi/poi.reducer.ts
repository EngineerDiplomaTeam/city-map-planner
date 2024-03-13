import { createReducer, on } from '@ngrx/store';
import { poiActions } from './poi.actions';

export type PointOfInterest = {
  id: number;
  map: {
    label: string;
    iconSrc: string;
    lat: number;
    lon: number;
  };
  details: {
    bannerSrc: string;
    title: string;
    description: string;
  };
};

export const POI_FEATURE_KEY = 'poi';
export interface PoiState {
  poiInBottomSheetId?: number;
  pointsOfInterest: PointOfInterest[];
}

const initialState: PoiState = { pointsOfInterest: [] };

export const poiReducer = createReducer(
  initialState,
  on(
    poiActions.poisLoaded,
    (state, { pois }): PoiState => ({
      ...state,
      pointsOfInterest: pois,
    }),
  ),
  on(
    poiActions.openBottomSheet,
    (state, { poiId }): PoiState => ({
      ...state,
      poiInBottomSheetId: poiId,
    }),
  ),
);
