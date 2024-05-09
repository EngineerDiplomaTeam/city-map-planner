import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  viewChild,
} from '@angular/core';
import { OlMapDirective } from '../open-layers-map/ol-map.directive';
import { JSONParser } from '@streamparser/json-whatwg';
import {
  OlLine,
  OlMapLineManager,
} from '../open-layers-map/ol-map-lines-manager.service';
import { pairwise } from '../utils';

interface PathFindingIteration {
  complete: boolean;
  route: {
    lat: number;
    lon: number;
    osmNodeId: number;
  }[];
}

@Component({
  selector: 'app-path-preview',
  standalone: true,
  imports: [],
  templateUrl: './path-preview.component.html',
  styleUrl: './path-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [OlMapDirective],
})
export class PathPreviewComponent implements OnInit {
  public from = input<string>();
  public to = input<string>();

  // protected readonly olMap = viewChild.required(OlMapDirective);
  // private readonly olMapLinesManager = computed(
  //   () => this.olMap().markerManager,
  // );

  public ngOnInit(): void {
    // void this.sample();
  }

  private async sample(): Promise<void> {
    // const response = await fetch(
    //   `/Api/PathFinding/GetPathBetweenPois?startingPoiId=${this.from()}&destinationPoiId=${this.to()}`,
    // );
    //
    // if (response.status !== 200 || !response.body) {
    //   console.error(response.statusText);
    //   return;
    // }
    //
    // const stream: ReadableStream<PathFindingIteration> = response.body
    //   .pipeThrough(
    //     new JSONParser({
    //       stringBufferSize: undefined,
    //       paths: ['$.*'],
    //       keepStack: false,
    //     }),
    //   )
    //   .pipeThrough(
    //     new TransformStream({ transform: (x, c) => c.enqueue(x.value) }),
    //   );
    //
    // const completeRoutes: PathFindingIteration['route'][] = [];
    //
    // const alreadyDrawn = new Set<number>();
    // for await (const { complete, route } of stream) {
    //   if (complete) completeRoutes.push(route);
    //
    //   for (const [from, to] of pairwise(route)) {
    //     if (alreadyDrawn.has(to.osmNodeId)) continue;
    //     alreadyDrawn.add(to.osmNodeId);
    //
    //     const line: OlLine = {
    //       from,
    //       to,
    //     };
    //
    //     this.olMapLinesManager.addLine(line);
    //   }
    // }
    //
    // this.olMapLinesManager.setLines([]);
    //
    // for (const completeRoute of completeRoutes) {
    //   for (const [from, to] of pairwise(completeRoute)) {
    //     const line: OlLine = {
    //       from,
    //       to,
    //     };
    //
    //     this.olMapLinesManager.addLine(line, 'red');
    //   }
    // }
  }
}
