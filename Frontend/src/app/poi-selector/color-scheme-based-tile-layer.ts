import { computed } from '@angular/core';
import { TileLayer, tileLayer } from 'leaflet';
import { useColorScheme } from './color-scheme-signal';

const attribution =
  '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>, <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const stadiaAlidadeSmooth = tileLayer(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
  {
    minZoom: 0,
    maxZoom: 20,
    attribution,
  },
);

const stadiaAlidadeSmoothDark = tileLayer(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
  {
    minZoom: 0,
    maxZoom: 20,
    attribution,
  },
);

export const useColorSchemeBasedTileLayer = () => {
  const colorScheme = useColorScheme();
  return computed<TileLayer>(() =>
    colorScheme() === 'dark' ? stadiaAlidadeSmoothDark : stadiaAlidadeSmooth,
  );
};
