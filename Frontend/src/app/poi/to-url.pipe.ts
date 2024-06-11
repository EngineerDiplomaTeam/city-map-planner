import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toUrl',
  standalone: true,
})
export class ToUrlPipe implements PipeTransform {
  public transform(value: string): string {
    return `url("${value}")`;
  }
}
