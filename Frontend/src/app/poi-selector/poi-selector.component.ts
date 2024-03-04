import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlTileLayer from 'ol/layer/Tile';
import { JsonPipe } from '@angular/common';
import { StadiaMaps, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { useColorScheme } from './color-scheme-signal';
import { boundingExtent } from 'ol/extent';
import { Feature } from 'ol';
import { LineString, Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Fill, Icon, Stroke, Style, Text as OlText } from 'ol/style';
import {
  DblClickDragZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';

@Component({
  selector: 'app-poi-selector',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './poi-selector.component.html',
  styleUrl: './poi-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiSelectorComponent {
  protected readonly tileLayer = new OlTileLayer();
  protected readonly mapElement = viewChild<ElementRef<HTMLElement>>('map');

  protected readonly olMap = computed(() => {
    const mainElem = this.mapElement()?.nativeElement;
    if (!mainElem) return;

    return new OlMap({
      layers: [this.tileLayer],
      target: mainElem,
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
  });

  constructor() {
    const colorScheme = useColorScheme();

    effect(() => {
      const layer =
        colorScheme() === 'dark' ? 'alidade_smooth_dark' : 'alidade_smooth';

      const stadiaSource = new StadiaMaps({
        layer,
        retina: true,
      });

      this.tileLayer.setSource(stadiaSource);
    });

    effect(() => {
      const map = this.olMap();
      if (!map) return;

      const lineFeature = new Feature({
        geometry: new LineString([
          fromLonLat([18.450213, 54.448977]),
          fromLonLat([18.800024, 54.271424]),
        ]),
      });

      lineFeature.setStyle(
        () =>
          new Style({
            stroke: new Stroke({
              color: '#cddc39',
              width: 5 / (map.getView().getResolution() ?? 1),
            }),
          }),
      );

      const makeMarker = (
        i: number,
        text: string,
        lon: number,
        lat: number,
      ) => {
        const markerFeature = new Feature({
          geometry: new Point(fromLonLat([lon, lat])),
        });

        markerFeature.setStyle(
          () =>
            new Style({
              image: new Icon({
                src: `/assets/poi-icons/${i}.png`,
                width: 256 / (map.getView().getResolution() ?? 1),
              }),
              text: new OlText({
                text,
                fill: new Fill({
                  color: [255, 255, 255, 1],
                }),
                backgroundFill: new Fill({
                  color: [168, 50, 153, 0.6],
                }),
                padding: [2, 2, 2, 2],
                scale: 1 / (map.getView().getResolution() ?? 1),
              }),
            }),
        );

        return markerFeature;
      };

      const vectorSource = new VectorSource({
        features: [
          lineFeature,
          makeMarker(0, 'Sample text', 18.6526853, 54.3589836),
          makeMarker(1, 'Test 2', 18.6484622, 54.3485459),
          makeMarker(2, 'Test 3', 18.6574016, 54.3560444),
        ],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
      });

      map.addLayer(vectorLayer);

      map.on('pointermove', (evt) => {
        const hit = map.forEachFeatureAtPixel(
          evt.pixel,
          function (_feature, _layer) {
            return true;
          },
          {
            // hitTolerance: 64 / (map.getView().getResolution() ?? 1),
          },
        );

        if (hit) {
          // Change cursor style when hovering over a feature
          map.getTargetElement().style.cursor = 'pointer';
        } else {
          // Reset cursor style when not hovering over a feature
          map.getTargetElement().style.cursor = '';
        }
      });
    });
  }
}
