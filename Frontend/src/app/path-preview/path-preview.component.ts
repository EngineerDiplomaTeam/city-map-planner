import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
} from '@angular/core';
import { OlMapDirective } from '../open-layers-map/ol-map.directive';
import { JSONParser } from '@streamparser/json-whatwg';
import {
  OlLine,
  OlMapLineManager,
} from '../open-layers-map/ol-map-lines-manager.service';
import { ActivatedRoute } from '@angular/router';
import { OL_MAP } from '../open-layers-map/ol-token';

@Component({
  selector: 'app-path-preview',
  standalone: true,
  imports: [],
  templateUrl: './path-preview.component.html',
  styleUrl: './path-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [OlMapDirective],
})
export class PathPreviewComponent {
  private readonly olMap = inject(OL_MAP);
  private readonly a = inject(ActivatedRoute);
  private readonly olMapLinesManager = inject(OlMapLineManager);

  constructor() {
    void this.sample();
  }

  private async sample(): Promise<void> {
    const response = await fetch(
      `/Api/PathFinding/test?from=${this.a.snapshot.params['from']}&to=${this.a.snapshot.params['to']}`,
    );

    if (response.status !== 200 || !response.body) {
      console.error(response.statusText);
      return;
    }

    const stream: ReadableStream<OlLine[]> = response.body
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

    let x = false;

    let last: any;
    for await (const l of stream) {
      if (!x) {
        x = true;
        const ll = this.olMapLinesManager.setLines(l);
        this.olMap.getView().fit(ll[0].getGeometry()!.getExtent(), {
          minResolution: 1,
        });
      }

      // console.log(l);
      // this.olMapLinesManager.setLines(l);
      // await new Promise((r) => setTimeout(r, 0));
      l.forEach((x: any) => this.olMapLinesManager.addLine(x));
      last = l;
      // this.olMapLinesManager.addLine(l);
    }

    console.log(last);
    last.forEach((x: any) => this.olMapLinesManager.addLine(x, 'red'));
  }
}
