import { Pipe, PipeTransform } from '@angular/core';
import { ManageablePoi } from './poi-manage.model';

@Pipe({
  name: 'requireUpdate',
  standalone: true,
})
export class RequireUpdatePipe implements PipeTransform {
  public transform(poi: ManageablePoi): boolean {
    const modified = new Date(poi.modified ?? '').getTime();

    let hoursPageModified: null | number = new Date(
      poi.businessHoursPageModified ?? '',
    ).getTime();

    let holidaysPageModified: null | number = new Date(
      poi.holidaysPageModified ?? '',
    ).getTime();

    if (Number.isNaN(hoursPageModified)) {
      hoursPageModified = 0;
    }

    if (Number.isNaN(holidaysPageModified)) {
      holidaysPageModified = 0;
    }

    return hoursPageModified > modified || holidaysPageModified > modified;
  }
}
