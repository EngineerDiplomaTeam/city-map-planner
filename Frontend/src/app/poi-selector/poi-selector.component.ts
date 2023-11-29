import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapOptions } from 'leaflet';
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

  protected readonly options: MapOptions = {
    zoom: 16,
    center: [54.3460523, 18.6559879],
  };
}
