import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
} from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  latLng,
  latLngBounds,
  Map as LeafletMap,
  MapOptions,
  polyline,
} from 'leaflet';
import { useColorSchemeBasedTileLayer } from './color-scheme-based-tile-layer';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-poi-selector',
  standalone: true,
  imports: [LeafletModule, JsonPipe],
  templateUrl: './poi-selector.component.html',
  styleUrl: './poi-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiSelectorComponent {
  protected readonly layerSignal = useColorSchemeBasedTileLayer();
  protected readonly mapSignal = signal<LeafletMap | undefined>(undefined);

  protected readonly options: MapOptions = {
    zoom: 16,
    center: [54.3460523, 18.6559879],
    maxBounds: latLngBounds(
      latLng([54.448977, 18.450213]),
      latLng([54.271424, 18.800024]),
    ),
    maxBoundsViscosity: 0.95,
    maxZoom: 20,
    minZoom: 13,
    preferCanvas: true,
  };

  constructor() {
    effect(() => {
      const m = this.mapSignal();
      if (!m) return;

      const l = polyline(
        [[latLng([54.448977, 18.450213]), latLng([54.271424, 18.800024])]],
        {
          color: '#cddc39',
          weight: 1,
        },
      );

      m.addLayer(l);
    });
  }
}
