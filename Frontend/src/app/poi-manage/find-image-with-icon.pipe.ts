import { Pipe, PipeTransform } from '@angular/core';
import { ManageablePoiImage } from './poi-manage.model';

@Pipe({
  name: 'findImageWithIcon',
  standalone: true,
})
export class FindImageWithIconPipe implements PipeTransform {
  public transform(
    images: ManageablePoiImage[],
  ): ManageablePoiImage | undefined {
    return images.find((x) => !!x.iconSrc);
  }
}
