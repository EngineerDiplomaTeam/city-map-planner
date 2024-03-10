import { inject, Injectable } from '@angular/core';
import {
  Circle,
  Fill as OlFill,
  Icon as OlIcon,
  Stroke,
  Style as OlStyle,
  Text as OlText,
} from 'ol/style';
import { OL_MAP } from './ol-token';
import OlVectorSource from 'ol/source/Vector';
import { Feature as OlFeature } from 'ol';
import OlVectorLayer from 'ol/layer/Vector';
import { Circle as OlCircle, Point as OlPoint } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Subject } from 'rxjs';

export interface OlMapMarker {
  id: number;
  iconSrc: string;
  lat: number;
  lon: number;
  label: string;
}

@Injectable()
export class OlMapMarkerManager {
  private static readonly featureKeyId = 'marker-id';
  protected readonly olMap = inject(OL_MAP);
  protected readonly vectorSource = new OlVectorSource();
  protected readonly vectorLayer = new OlVectorLayer({
    source: this.vectorSource,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });

  public readonly markerClick$ = new Subject<number>();

  constructor() {
    this.olMap.addLayer(this.vectorLayer);

    this.olMap.on('singleclick', (evt) => {
      const [feature] = this.olMap.getFeaturesAtPixel(evt.pixel);
      if (!feature) return;

      const markerId: number = feature.get(OlMapMarkerManager.featureKeyId);
      if (markerId === undefined) return;

      this.markerClick$.next(markerId);
    });
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

  private get markerImageWidth(): number {
    return this.olMapSmallerDimension / this.olMapResolution;
  }

  private createMarkerImage(iconSrc: string): OlIcon {
    return new OlIcon({
      src: iconSrc,
      width: this.markerImageWidth,
    });
  }

  private createMarkerText(label: string): OlText {
    return new OlText({
      text: label,
      font: '72px',
      fill: new OlFill({
        color: [255, 255, 255, 1],
      }),
      backgroundFill: new OlFill({
        color: [0, 0, 0, 0.6],
      }),
      padding: [2, 2, 2, 2],
      scale: 1 / this.olMapResolution,
    });
  }

  private createMarkerFeatures({
    lat,
    lon,
    id,
    iconSrc,
    label,
  }: OlMapMarker): OlFeature[] {
    const imageFeature = new OlFeature({
      geometry: new OlPoint(fromLonLat([lon, lat])),
    });

    imageFeature.setStyle(
      () =>
        new OlStyle({
          image: this.createMarkerImage(iconSrc),
          text: this.createMarkerText(label),
        }),
    );

    const borderFeature = new OlFeature({
      geometry: new OlPoint(fromLonLat([lon, lat])),
    });

    borderFeature.setStyle(
      () =>
        new OlStyle({
          image: new Circle({
            radius: this.markerImageWidth / 2,
            stroke: new Stroke({
              color: '#cddc39',
              width: 10 / this.olMapResolution,
            }),
          }),
        }),
    );

    imageFeature.set(OlMapMarkerManager.featureKeyId, id);
    borderFeature.set(OlMapMarkerManager.featureKeyId, id);

    return [imageFeature];
  }

  public addMarkers(markers: OlMapMarker[]): void {
    const features = markers.map((x) => this.createMarkerFeatures(x)).flat();

    this.vectorSource.addFeatures(features);
  }
}
