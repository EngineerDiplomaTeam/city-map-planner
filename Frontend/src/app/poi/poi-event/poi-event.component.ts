import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ToDataEventPipe } from '../to-data-event.pipe';
import { ToDurationPipe } from '../to-duration.pipe';
import { ToHeightPipe } from '../to-height.pipe';
import { ToUrlPipe } from '../to-url.pipe';
import { PointOfInterest } from '../poi.reducer';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PoiScheduleStore } from '../poi-schedule/poi-schedule.store';
import { IdToColorPipe } from '../id-to-color.pipe';

@Component({
  selector: 'app-poi-event',
  standalone: true,
  imports: [
    ToDataEventPipe,
    ToDurationPipe,
    ToHeightPipe,
    ToUrlPipe,
    MatIconButton,
    MatIcon,
    IdToColorPipe,
  ],
  templateUrl: './poi-event.component.html',
  styleUrl: './poi-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiEventComponent {
  protected readonly scheduleStore = inject(PoiScheduleStore);
  public poi = input.required<PointOfInterest>();
  public id = input<string>();
}
