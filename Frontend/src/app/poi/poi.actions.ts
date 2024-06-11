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
    'Pois loaded': props<{ pois: PointOfInterest[] }>(),
    'Add to basket': props<{ poiId: PointOfInterest['id'] }>(),
    'Remove from basket': props<{ poiId: PointOfInterest['id'] }>(),
    'Open basked': emptyProps(),
    'Close basked': emptyProps(),
    'Basked dialog opened': props<{ id: string }>(),
    'Basked dialog closed': emptyProps(),
  },
});
