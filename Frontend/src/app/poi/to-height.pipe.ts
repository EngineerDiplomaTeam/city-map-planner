import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toHeight',
  standalone: true,
})
export class ToHeightPipe implements PipeTransform {
  // HH:mm:SS
  transform(value: string): string {
    const [hours, minutes, seconds] = value.split(':').map(Number);

    return `${hours * 80 + minutes * 1.33 + seconds * 0}px`;
  }
}
