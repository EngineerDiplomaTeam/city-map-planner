import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idToColor',
  standalone: true,
})
export class IdToColorPipe implements PipeTransform {
  public transform(id: number): string {
    return `poi-color-${IdToColorPipe.getColorForId(id)}`;
  }

  private static colors = new Map<number, number>();
  public static getColorForId(id: number): number {
    if (this.colors.has(id)) {
      return this.colors.get(id)!;
    }

    this.colors.set(id, this.colors.size + 1);
    return this.colors.get(id)!;
  }
}
