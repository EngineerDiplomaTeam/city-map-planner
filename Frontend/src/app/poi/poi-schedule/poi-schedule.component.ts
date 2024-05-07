import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import {
  MatSidenavContainer,
  MatSidenavModule,
} from '@angular/material/sidenav';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { ToDurationPipe } from '../poi-basket-dialog/to-duration.pipe';
import { ToHeightPipe } from '../poi-basket-dialog/to-height.pipe';
import { ToUrlPipe } from '../poi-basket-dialog/to-url.pipe';
import { Store } from '@ngrx/store';
import { poiActions } from '../poi.actions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TimeRangePickerComponent } from '../../time-range-picker/time-range-picker.component';
import { PoiScheduleStore } from './poi-schedule.store';
import { ToDataEventPipe } from '../to-data-event.pipe';
import { PoiEventComponent } from '../poi-event/poi-event.component';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatActionList, MatListItem } from '@angular/material/list';
import { selectAllPois } from '../poi.selectors';

@Component({
  selector: 'app-poi-schedule',
  standalone: true,
  imports: [
    MatToolbar,
    MatSidenavModule,
    FullCalendarModule,
    CdkDrag,
    ToDurationPipe,
    ToHeightPipe,
    ToUrlPipe,
    FormsModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSuffix,
    TimeRangePickerComponent,
    ReactiveFormsModule,
    ToDataEventPipe,
    PoiEventComponent,
    JsonPipe,
    MatAnchor,
    RouterLink,
    MatActionList,
    MatListItem,
  ],
  templateUrl: './poi-schedule.component.html',
  styleUrl: './poi-schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiScheduleComponent {
  protected readonly dragableUnassignedPois = viewChild.required(
    'dragableUnassignedPois',
    { read: ElementRef<HTMLElement> },
  );
  protected readonly sidenavContainer = viewChild.required(MatSidenavContainer);
  protected readonly fullCalendar = viewChild.required(FullCalendarComponent);
  protected readonly eventContent = viewChild.required('eventContent', {
    read: TemplateRef,
  });

  protected readonly store = inject(Store);
  protected readonly poiScheduleStore = inject(PoiScheduleStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly poisInBasket = this.store.selectSignal(selectAllPois);

  protected readonly calendarOptions = computed<CalendarOptions | undefined>(
    () =>
      !this.eventContent()
        ? undefined
        : {
            plugins: [
              resourceTimeGridPlugin,
              interactionPlugin,
              resourceTimelinePlugin,
            ],
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            initialView: 'resourceTimeGridDay',
            slotLabelFormat: {
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
              hour12: false,
            },
            slotLaneClassNames: ['slot-lane'],
            viewClassNames: ['fl-view-custom'],
            headerToolbar: false,
            allDaySlot: false,
            editable: true,
            eventStartEditable: true,
            eventResourceEditable: true,
            eventDurationEditable: false,
            droppable: true,
            // eventContent: this.eventContent(),
            // eventReceive: (e) => {
            //   console.log(e);
            // },
            eventOverlap: (a, b) => {
              return Boolean(a.groupId ?? b?.groupId); // Allow overlap only when placing event on resource constraint
            },
          },
  );

  protected readonly dragableUnassignedPoisEffect = effect(() => {
    const draggable = new Draggable(
      this.dragableUnassignedPois().nativeElement,
      {
        itemSelector: 'app-poi-event',
      },
    );

    this.destroyRef.onDestroy(() => draggable.destroy());
  });

  constructor() {
    this.store.dispatch(poiActions.loadPois());
  }

  public async toggleSidenavs(): Promise<void> {
    await this.sidenavContainer().start?.toggle();
    this.fullCalendar().getApi().render();
  }
}
