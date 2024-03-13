import { computed } from '@angular/core';
import { useColorScheme } from './color-scheme-signal';
import { StadiaMaps } from 'ol/source';

const stadiaAlidadeSmooth = new StadiaMaps({
  layer: 'alidade_smooth',
  retina: true,
});

const stadiaAlidadeSmoothDark = new StadiaMaps({
  layer: 'alidade_smooth_dark',
  retina: true,
});

export const useColorSchemeBasedTileLayer = () => {
  const colorScheme = useColorScheme();
  return computed<StadiaMaps>(() =>
    colorScheme() === 'dark' ? stadiaAlidadeSmoothDark : stadiaAlidadeSmooth,
  );
};
