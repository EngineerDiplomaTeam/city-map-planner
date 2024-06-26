import { EventEmitter, inject, Injectable, NgZone } from '@angular/core';
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
import { Point as OlPoint } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { clamp } from 'ol/math';
import { poiActions } from '../poi/poi.actions';
import { Store } from '@ngrx/store';

export interface OlMapMarker {
  id: number;
  iconSrc: string;
  lat: number;
  lon: number;
  label: string;
}

export interface OlMapNumericMarker {
  number: number;
  lat: number;
  lon: number;
}

@Injectable()
export class OlMapMarkerManager {
  private static readonly featureKeyId = 'marker-id';
  private readonly zone = inject(NgZone);
  protected readonly store = inject(Store);
  protected readonly olMap = inject(OL_MAP);
  protected readonly vectorSource = new OlVectorSource();
  protected readonly vectorLayer = new OlVectorLayer({
    source: this.vectorSource,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });

  public readonly markerClicked = new EventEmitter<number>();

  constructor() {
    this.olMap.addLayer(this.vectorLayer);

    this.olMap.on('click', (evt) => {
      const [feature] = this.olMap.getFeaturesAtPixel(evt.pixel);
      if (!feature) return;

      const markerId: string = feature.get(OlMapMarkerManager.featureKeyId);
      if (markerId === undefined) return;

      this.zone.run(() => {
        this.markerClicked.emit(Number(markerId));
        this.store.dispatch(
          poiActions.mapMarkerClicked({ markerId: Number(markerId) }),
        );
      });
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const context = canvas.getContext('2d')!;

    context.drawImage(bitmap, 0, 0, 512, 512);
    context.arc(512 / 2, 512 / 2, 512 / 2 - 5 / 2, 0, 2 * Math.PI);
    context.strokeStyle = '#cddc39';
    context.lineWidth = 5;
    context.stroke();

    return canvas.transferToImageBitmap();
  }

  private createMarkerImage(icon: ImageBitmap): OlIcon {
    const scaled = this.olMapSmallerDimension / this.olMapResolution;
    const min = this.olMapSmallerDimension / 20;
    const max = this.olMapSmallerDimension / 3;

    return new OlIcon({
      img: icon,
      width: clamp(scaled, min, max),
    });
  }

  private createMarkerText(label: string): OlText {
    const scaled = this.olMapSmallerDimension / this.olMapResolution / 400;
    const min = 0.1;
    const max = 3;

    return new OlText({
      text: label,
      fill: new OlFill({
        color: [255, 255, 255, 1],
      }),
      backgroundFill: new OlFill({
        color: [0, 0, 0, 0.6],
      }),
      padding: [2, 2, 2, 2].map((x) => x / this.olMapResolution),
      scale: clamp(scaled, min, max),
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
      geometry: new OlPoint(fromLonLat([lon, lat])),
    });

    markerFeature.set(OlMapMarkerManager.featureKeyId, id);

    try {
      const iconImg = await this.createIconImg(iconSrc);

      markerFeature.setStyle(
        () =>
          new OlStyle({
            image: this.createMarkerImage(iconImg),
            text: this.createMarkerText(label),
          }),
      );
    } catch (e) {
      console.log(e, iconSrc);
      // nothing
    }

    return markerFeature;
  }

  public async setMarkers(markers: OlMapMarker[]): Promise<void> {
    const features = await Promise.all(
      markers.map((x) => this.createMarkerFeature(x)),
    );

    this.vectorSource.clear();
    this.vectorSource.addFeatures(features);
  }

  public async addNumericMarker(marker: OlMapNumericMarker): Promise<void> {
    const markerFeature = new OlFeature({
      geometry: new OlPoint(fromLonLat([marker.lon, marker.lat])),
    });

    markerFeature.set(OlMapMarkerManager.featureKeyId, marker.number);

    const size = 24 * window.devicePixelRatio;

    const canvas = new OffscreenCanvas(size, size);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const context = canvas.getContext('2d')!;

    context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    context.fillStyle = '#cddc39';
    context.fill();

    const background = canvas.transferToImageBitmap();

    markerFeature.setStyle(
      () =>
        new OlStyle({
          image: new OlIcon({
            img: background,
            width: size / window.devicePixelRatio,
          }),
          text: new OlText({
            text: `${marker.number}`,
            font: '16px Roboto, "Helvetica Neue", sans-serif',
            fill: new OlFill({
              color: [0, 0, 0, 1],
            }),
            padding: [2, 2, 2, 2].map((x) => x / this.olMapResolution),
          }),
        }),
    );

    this.vectorSource.addFeature(markerFeature);
  }
}
