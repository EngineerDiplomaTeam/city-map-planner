import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PointOfInterest } from './poi.reducer';

export const poiActions = createActionGroup({
  source: 'Poi',
  events: {
    'Map marker clicked': props<{ markerId: number }>(),
    'Open bottom sheet': props<{ poiId: number }>(),
    'Bottom sheet opened': props<{ bottomSheetId: string }>(),
    'Bottom sheet closed': emptyProps(),
    'Load pois': emptyProps(),
    'pois loaded': props<{ pois: PointOfInterest[] }>(),
  },
});
