import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { OlMapDirective } from '../../open-layers-map/ol-map.directive';
import { MatStepperModule } from '@angular/material/stepper';
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
  OlMapMarker,
  OlMapMarkerManager,
} from '../../open-layers-map/ol-map-marker-manager.service';
import { OL_MAP } from '../../open-layers-map/ol-token';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';

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
  imports: [OlMapDirective, MatStepperModule, MatButton, DatePipe],
  templateUrl: './poi-summary.component.html',
  styleUrl: './poi-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiSummaryComponent implements OnInit {
  protected readonly olMapDirective = viewChild.required(OlMapDirective);

  private readonly olMapLinesManager = computed(() =>
    this.olMapDirective().injector.get(OlMapLineManager),
  );

  private readonly olMapMarkerManager = computed(() =>
    this.olMapDirective().injector.get(OlMapMarkerManager),
  );

  private readonly olMap = computed(() =>
    this.olMapDirective().injector.get(OL_MAP),
  );

  protected readonly poiScheduleStore = inject(PoiScheduleStore);

  ngOnInit(): void {
    this.onStepChange(0);
  }

  public onStepChange(index: number): void {
    const eventAtIndex = this.poiScheduleStore.scheduledEvents()[index];

    if (!eventAtIndex) return;

    const previousEvent = this.poiScheduleStore.scheduledEvents()[index - 1];

    const markers: OlMapMarker[] = [];

    markers.push({
      iconSrc: eventAtIndex.extendedProps.poi.map.iconSrc,
      id: eventAtIndex.extendedProps.poi.id,
      label: eventAtIndex.extendedProps.poi.map.label,
      lat: eventAtIndex.extendedProps.poi.map.lat,
      lon: eventAtIndex.extendedProps.poi.map.lon,
    });

    this.olMap()
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
      void this.olMapMarkerManager().setMarkers(markers);
      return;
    }

    markers.push({
      iconSrc: previousEvent.extendedProps.poi.map.iconSrc,
      id: previousEvent.extendedProps.poi.id,
      label: previousEvent.extendedProps.poi.map.label,
      lat: previousEvent.extendedProps.poi.map.lat,
      lon: previousEvent.extendedProps.poi.map.lon,
    });

    void this.olMapMarkerManager().setMarkers(markers);

    void this.showRouteBetween(
      eventAtIndex.extendedProps.poi.id,
      previousEvent.extendedProps.poi.id,
    );
  }

  private async showRouteBetween(from: number, to: number): Promise<void> {
    const manager = this.olMapLinesManager();

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
