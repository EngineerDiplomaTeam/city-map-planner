import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { OlMapDirective } from '../../open-layers-map/ol-map.directive';
import { Store } from '@ngrx/store';
import { poiActions } from '../poi.actions';
import { selectOlMarkers } from '../poi.selectors';
import { OlMapMarkerManager } from '../../open-layers-map/ol-map-marker-manager.service';

@Component({
  selector: 'app-poi',
  hostDirectives: [OlMapDirective],
  standalone: true,
  templateUrl: './poi-selector.component.html',
  styleUrl: './poi-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiSelectorComponent {
  private readonly store = inject(Store);
  private readonly olMarkers = this.store.selectSignal(selectOlMarkers);
  private readonly olMapMarkerManager = inject(OlMapMarkerManager);

  constructor() {
    this.store.dispatch(poiActions.loadPois());

    effect(() => void this.olMapMarkerManager.setMarkers(this.olMarkers()));
  }
}
