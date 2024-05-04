import { Pipe, PipeTransform } from '@angular/core';
import { formatDuration } from 'date-fns';

@Pipe({
  name: 'toDuration',
  standalone: true,
})
export class ToDurationPipe implements PipeTransform {
  // HH:mm:SS
  transform(value: string): string {
    const [hours, minutes, seconds] = value.split(':').map(Number);

    return formatDuration({ hours, minutes, seconds });
  }
}
