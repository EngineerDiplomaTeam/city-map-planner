import { inject, Injectable } from '@angular/core';
import {
  Fill as OlFill,
  Icon as OlIcon,
  Style as OlStyle,
  Stroke as OlStroke,
} from 'ol/style';
import { OL_MAP } from './ol-token';
import OlVectorSource from 'ol/source/Vector';
import { Feature as OlFeature } from 'ol';
import OlVectorLayer from 'ol/layer/Vector';
import { LineString as OlLineString, Point as OlPoint } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { clamp } from 'ol/math';
import { poiActions } from '../poi/poi.actions';
import { Store } from '@ngrx/store';

export interface OlLine {
  from: {
    lat: number;
    lon: number;
  };

  to: {
    lat: number;
    lon: number;
  };
}

@Injectable()
export class OlMapLineManager {
  private static readonly featureKeyId = 'line-id';
  protected readonly olMap = inject(OL_MAP);
  protected readonly vectorSource = new OlVectorSource();
  protected readonly vectorLayer = new OlVectorLayer({
    source: this.vectorSource,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });

  constructor() {
    this.olMap.addLayer(this.vectorLayer);
  }

  private get olMapResolution(): number {
    return this.olMap.getView().getResolution() ?? 1;
  }

  private get olMapSmallerDimension(): number {
    const { height, width } = this.olMap
      .getTargetElement()
      .getBoundingClientRect();

    return Math.min(height, width);
  }

  private createLineFeature({ from, to }: OlLine, color?: string): OlFeature {
    // console.log([from.lon, from.lat]);
    const markerFeature = new OlFeature({
      geometry: new OlLineString([
        fromLonLat([from.lon, from.lat]),
        fromLonLat([to.lon, to.lat]),
      ]),
    });

    // markerFeature.set(OlLin.featureKeyId, id);

    markerFeature.setStyle(
      () =>
        new OlStyle({
          fill: new OlFill({ color: color ?? '#00FF00' }),
          stroke: new OlStroke({ color: color ?? '#00FF00', width: 2 }),
        }),
    );

    return markerFeature;
  }

  public addLine(line: OlLine, color?: string): void {
    const feature = this.createLineFeature(line, color);
    this.vectorSource.addFeature(feature);

    // this.olMap.getView().fit(feature.getGeometry()!.getExtent(), {
    //   minResolution: 0.4,
    // });
  }

  public setLines(lines: OlLine[]): OlFeature[] {
    const features = lines.map((x) => this.createLineFeature(x));

    this.vectorSource.clear();
    this.vectorSource.addFeatures(features);

    return features;
  }
}
