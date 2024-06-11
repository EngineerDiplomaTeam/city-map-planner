import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { OlMapDirective } from '../../open-layers-map/ol-map.directive';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { PoiScheduleStore } from '../poi-schedule/poi-schedule.store';
import { DatePipe } from '@angular/common';
import {
  OlLine,
  OlMapLineManager,
} from '../../open-layers-map/ol-map-lines-manager.service';
import { JSONParser } from '@streamparser/json-whatwg';
import { pairwise } from '../../utils';
import {
  OlMapMarkerManager,
  OlMapNumericMarker,
} from '../../open-layers-map/ol-map-marker-manager.service';
import { OL_MAP } from '../../open-layers-map/ol-token';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WeatherIconsService } from '../../weather-icons/weather-icons-service';
import { WeatherIconsComponent } from '../../weather-icons/weather-icons.component';

interface PathFindingIteration {
  complete: boolean;
  route: {
    lat: number;
    lon: number;
    osmNodeId: number;
  }[];
}

@Component({
  selector: 'app-poi-summary',
  standalone: true,
  imports: [
    OlMapDirective,
    MatStepperModule,
    MatButton,
    DatePipe,
    WeatherIconsComponent,
  ],
  templateUrl: './poi-summary.component.html',
  styleUrl: './poi-summary.component.scss',
  hostDirectives: [OlMapDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiSummaryComponent implements OnInit {

  private readonly olMapLinesManager = inject(OlMapLineManager);
  private readonly olMapMarkerManager = inject(OlMapMarkerManager);
  private readonly olMap = inject(OL_MAP);
  protected readonly poiScheduleStore = inject(PoiScheduleStore);
  protected readonly steeper = viewChild.required(MatStepper);

  private readonly setMarkersEffect = effect(() => {
    const pois = this.poiScheduleStore.scheduledEvents();

    const markers: OlMapNumericMarker[] = pois.map((x, i) => ({
      number: i + 1,
      lat: x.extendedProps.poi.map.lat,
      lon: x.extendedProps.poi.map.lon,
    }));

    for (const marker of markers) {
      void this.olMapMarkerManager.addNumericMarker(marker);
    }
  });

  private readonly clickMarkerEffect = this.olMapMarkerManager.markerClicked
    .pipe(takeUntilDestroyed())
    .subscribe((id) => {
      const index = id - 1;
      this.steeper().selectedIndex = index;
      this.onStepChange(index);
    });

  ngOnInit(): void {
    this.onStepChange(0);
  }

  public onStepChange(index: number): void {
    const eventAtIndex = this.poiScheduleStore.scheduledEvents()[index];

    if (!eventAtIndex) return;

    const previousEvent = this.poiScheduleStore.scheduledEvents()[index - 1];

    this.olMap
      .getView()
      .fit(
        new Point(
          fromLonLat([
            eventAtIndex.extendedProps.poi.map.lon,
            eventAtIndex.extendedProps.poi.map.lat,
          ]),
        ),
      );

    if (!eventAtIndex || !previousEvent) {
      return;
    }

    void this.showRouteBetween(
      eventAtIndex.extendedProps.poi.id,
      previousEvent.extendedProps.poi.id,
    );
  }

  private async showRouteBetween(from: number, to: number): Promise<void> {
    const manager = this.olMapLinesManager;

    const response = await fetch(
      `/Api/PathFinding/GetPathBetweenPois?startingPoiId=${from}&destinationPoiId=${to}`,
    );

    if (response.status !== 200 || !response.body) {
      console.error(response.statusText);
      return;
    }

    const stream: ReadableStream<PathFindingIteration> = response.body
      .pipeThrough(
        new JSONParser({
          stringBufferSize: undefined,
          paths: ['$.*'],
          keepStack: false,
        }),
      )
      .pipeThrough(
        new TransformStream({ transform: (x, c) => c.enqueue(x.value) }),
      );

    const completeRoutes: PathFindingIteration['route'][] = [];
    manager.setLines([]);

    const alreadyDrawn = new Set<number>();
    for await (const { complete, route } of stream) {
      if (complete) completeRoutes.push(route);

      for (const [from, to] of pairwise(route)) {
        if (alreadyDrawn.has(to.osmNodeId)) continue;
        alreadyDrawn.add(to.osmNodeId);

        const line: OlLine = {
          from,
          to,
        };

        manager.addLine(line);
      }
    }

    manager.setLines([]);

    for (const completeRoute of completeRoutes) {
      for (const [from, to] of pairwise(completeRoute)) {
        const line: OlLine = {
          from,
          to,
        };

        manager.addLine(line, 'red');
      }
    }
  }
}
