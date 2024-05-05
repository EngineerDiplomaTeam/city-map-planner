import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ToDataEventPipe } from '../to-data-event.pipe';
import { ToDurationPipe } from '../poi-basket-dialog/to-duration.pipe';
import { ToHeightPipe } from '../poi-basket-dialog/to-height.pipe';
import { ToUrlPipe } from '../poi-basket-dialog/to-url.pipe';
import { PointOfInterest } from '../poi.reducer';

@Component({
  selector: 'app-poi-event',
  standalone: true,
  imports: [ToDataEventPipe, ToDurationPipe, ToHeightPipe, ToUrlPipe],
  templateUrl: './poi-event.component.html',
  styleUrl: './poi-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiEventComponent {
  public poi = input.required<PointOfInterest>();
}
