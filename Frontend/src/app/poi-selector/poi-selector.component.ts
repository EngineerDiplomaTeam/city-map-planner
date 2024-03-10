import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  BottomSheetData,
  PoiBottomSheetComponent,
} from './poi-bottom-sheet/poi-bottom-sheet.component';
import { OlMapDirective } from '../open-layers-map/ol-map.directive';
import { OlMapMarkerManager } from '../open-layers-map/ol-map-marker-manager.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-poi-selector',
  hostDirectives: [OlMapDirective],
  standalone: true,
  imports: [],
  templateUrl: './poi-selector.component.html',
  styleUrl: './poi-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiSelectorComponent {
  private readonly olMapMarkerManager = inject(OlMapMarkerManager);
  protected readonly matBottomSheet = inject(MatBottomSheet);
  protected readonly pois = [
    {
      id: 0,
      iconSrc: '/assets/temp/icon.avif',
      lon: 18.6526853,
      lat: 54.3589836,
      label: 'Bazylika Mariacka',
    },
    {
      id: 1,
      iconSrc: '/assets/temp/icon.avif',
      lon: 18.6484622,
      lat: 54.3485459,
      label: 'Fontanna Neptuna',
    },
    {
      id: 2,
      iconSrc: '/assets/temp/icon.avif',
      lon: 18.6574016,
      lat: 54.3560444,
      label: 'Muzeum II Wojny Światowej',
    },
  ];

  constructor() {
    this.olMapMarkerManager.addMarkers(this.pois);

    this.olMapMarkerManager.markerClick$
      .pipe(takeUntilDestroyed())
      .subscribe((id) => {
        this.matBottomSheet.open<PoiBottomSheetComponent, BottomSheetData>(
          PoiBottomSheetComponent,
          {
            data: { id },
          },
        );
      });
  }
}
