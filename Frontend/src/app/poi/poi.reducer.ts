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
  baskedDialogId?: string;
  pointsOfInterest: PointOfInterest[];
  poisInBasket: PointOfInterest['id'][];
}

const initialState: PoiState = { pointsOfInterest: [], poisInBasket: [] };

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
  on(
    poiActions.addToBasket,
    (state, { poiId }): PoiState => ({
      ...state,
      poisInBasket: state.poisInBasket.concat(poiId),
    }),
  ),
  on(
    poiActions.removeFromBasket,
    (state, { poiId }): PoiState => ({
      ...state,
      poisInBasket: state.poisInBasket.filter((id) => id !== poiId),
    }),
  ),
  on(
    poiActions.baskedDialogOpened,
    (state, { id }): PoiState => ({
      ...state,
      baskedDialogId: id,
    }),
  ),
  on(
    poiActions.baskedDialogClosed,
    (state): PoiState => ({
      ...state,
      baskedDialogId: undefined,
    }),
  ),
);
