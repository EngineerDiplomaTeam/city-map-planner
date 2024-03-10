import { InjectionToken } from '@angular/core';
import OlMap from 'ol/Map';
import OlTileLayer from 'ol/layer/Tile';
import OlTileSource from 'ol/source/Tile';

export const OL_MAP = new InjectionToken<OlMap>('Open Layers Map Instance');
export const OL_TILE_LAYER = new InjectionToken<OlTileLayer<OlTileSource>>(
  'Open Layers Tile Layer Instance',
);
