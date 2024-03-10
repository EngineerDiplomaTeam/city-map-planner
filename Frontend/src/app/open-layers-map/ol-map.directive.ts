import { Directive, effect, ElementRef, inject } from '@angular/core';
import { OL_MAP, OL_TILE_LAYER } from './ol-token';
import { useColorScheme } from '../poi-selector/color-scheme-signal';
import OlTileLayer from 'ol/layer/Tile';
import OlTileSource from 'ol/source/Tile';
import OlMap from 'ol/Map';
import {
  DblClickDragZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';
import OlView from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { boundingExtent } from 'ol/extent';
import { StadiaMaps } from 'ol/source';
import { OlMapMarkerManager } from './ol-map-marker-manager.service';

@Directive({
  selector: '[appOlMap]',
  standalone: true,
  providers: [
    {
      provide: OL_MAP,
      useFactory: (self: OlMapDirective): OlMap => self.olMap,
      deps: [OlMapDirective],
    },
    {
      provide: OL_TILE_LAYER,
      useFactory: (self: OlMapDirective): OlTileLayer<OlTileSource> =>
        self.tileLayer,
      deps: [OlMapDirective],
    },
    OlMapMarkerManager,
  ],
})
export class OlMapDirective {
  protected readonly elementRef = inject(ElementRef);
  protected readonly colorScheme = useColorScheme();
  protected readonly tileLayer = new OlTileLayer();

  protected readonly olMap = new OlMap({
    layers: [this.tileLayer],
    target: this.elementRef.nativeElement,
    controls: [],
    interactions: defaultInteractions().extend([
      new DblClickDragZoom({
        delta: -0.003,
      }),
    ]),
    view: new OlView({
      center: fromLonLat([18.6559879, 54.3460523]),
      zoom: 14,
      maxZoom: 20,
      minZoom: 13,
      extent: boundingExtent([
        fromLonLat([18.450213, 54.448977]),
        fromLonLat([18.800024, 54.271424]),
      ]),
    }),
  });

  constructor() {
    this.olMap.on('pointermove', (evt) => {
      const hit = this.olMap.hasFeatureAtPixel(evt.pixel);

      if (hit) {
        // Change cursor style when hovering over a feature
        this.olMap.getTargetElement().style.cursor = 'pointer';
      } else {
        // Reset cursor style when not hovering over a feature
        this.olMap.getTargetElement().style.cursor = '';
      }
    });

    effect(() => {
      const layer =
        this.colorScheme() === 'dark'
          ? 'alidade_smooth_dark'
          : 'alidade_smooth';

      const stadiaSource = new StadiaMaps({
        layer,
        retina: true,
      });

      this.tileLayer.setSource(stadiaSource);
    });
  }
}
