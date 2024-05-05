import { Pipe, PipeTransform } from '@angular/core';
import { PointOfInterest } from './poi.reducer';

@Pipe({
  name: 'toDataEvent',
  standalone: true,
})
export class ToDataEventPipe implements PipeTransform {
  public transform(value: PointOfInterest): string {
    return JSON.stringify({
      title: value.map.label,
      duration: value.preferredSightseeingTime,
      extendedProps: { poi: value },
      classNames: ['pure-container'],
    });
  }
}
