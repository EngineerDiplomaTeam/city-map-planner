import { inject, Injectable } from '@angular/core';
import {
  Fill as OlFill,
  Icon as OlIcon,
  Style as OlStyle,
  Text as OlText,
} from 'ol/style';
import { OL_MAP } from './ol-token';
import OlVectorSource from 'ol/source/Vector';
import { Feature as OlFeature } from 'ol';
import OlVectorLayer from 'ol/layer/Vector';
import { Point } from 'ol/geom';
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

  private async createIconImg(iconSrc: string): Promise<ImageBitmap> {
    const response = await fetch(iconSrc);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(512, 512);
    const context = canvas.getContext('2d')!;

    context.drawImage(bitmap, 0, 0, 512, 512);
    context.arc(512 / 2, 512 / 2, 512 / 2, 0, 2 * Math.PI);
    context.strokeStyle = '#cddc39';
    context.lineWidth = 5;
    context.stroke();

    return canvas.transferToImageBitmap();
  }

  private createMarkerImage(icon: ImageBitmap): OlIcon {
    return new OlIcon({
      img: icon,
      width: this.olMapSmallerDimension / this.olMapResolution,
    });
  }

  private createMarkerText(label: string): OlText {
    return new OlText({
      text: label,
      fill: new OlFill({
        color: [255, 255, 255, 1],
      }),
      backgroundFill: new OlFill({
        color: [168, 50, 153, 0.6],
      }),
      padding: [2, 2, 2, 2],
      scale: 1 / this.olMapResolution,
    });
  }

  private async createMarkerFeature({
    lat,
    lon,
    id,
    iconSrc,
    label,
  }: OlMapMarker): Promise<OlFeature> {
    const markerFeature = new OlFeature({
      geometry: new Point(fromLonLat([lon, lat])),
    });

    markerFeature.set(OlMapMarkerManager.featureKeyId, id);

    const iconImg = await this.createIconImg(iconSrc);

    markerFeature.setStyle(
      () =>
        new OlStyle({
          image: this.createMarkerImage(iconImg),
          text: this.createMarkerText(label),
        }),
    );

    return markerFeature;
  }

  public async addMarkers(markers: OlMapMarker[]): Promise<void> {
    const features = await Array.fromAsync(
      markers.map((x) => this.createMarkerFeature(x)),
    );

    this.vectorSource.addFeatures(features);
  }
}
