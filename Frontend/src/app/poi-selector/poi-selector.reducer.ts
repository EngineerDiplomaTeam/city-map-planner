import { createReducer } from '@ngrx/store';

export type PointOfInterest = {
  id: number;
  map: {
    label: string;
    iconSrc: string;
    lat: number;
    lot: number;
  };
  details: {
    bannerSrc: string;
    title: string;
    description: string;
  };
};

export const POI_SELECTOR_FEATURE_KEY = 'poi-selector';
export interface PoiSelectorState {
  poiBottomSheetId?: number;
  pointsOfInterest: PointOfInterest[];
}

const initialState: PoiSelectorState = { pointsOfInterest: [] };

export const authReducer = createReducer(
  initialState,
  // on(
  //   authActions.dialogOpened,
  //   (state, { id }): PoiSelectorState => ({
  //     ...state,
  //     dialogId: id,
  //   }),
  // ),
);
