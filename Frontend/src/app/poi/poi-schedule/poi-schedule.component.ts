import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
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
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { ToDurationPipe } from '../poi-basket-dialog/to-duration.pipe';
import { ToHeightPipe } from '../poi-basket-dialog/to-height.pipe';
import { ToUrlPipe } from '../poi-basket-dialog/to-url.pipe';
import { PointOfInterest } from '../poi.reducer';
import { selectAllPois } from '../poi.selectors';
import { Store } from '@ngrx/store';
import { poiActions } from '../poi.actions';

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
  ],
  templateUrl: './poi-schedule.component.html',
  styleUrl: './poi-schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiScheduleComponent {
  protected readonly sidenavContainer = viewChild.required(MatSidenavContainer);
  protected readonly fullCalendar = viewChild.required(FullCalendarComponent);
  protected readonly eventContent = viewChild.required('eventContent', {
    read: TemplateRef,
  });

  protected readonly store = inject(Store);
  protected readonly cdr = inject(ChangeDetectorRef);

  protected readonly poisInBasket = this.store.selectSignal(selectAllPois);

  protected unassignedPois: PointOfInterest[] = [];

  protected readonly addInitialUnassignedPoisEffect = effect(() => {
    // TODO: Filter out these that are assigned
    this.unassignedPois = structuredClone(this.poisInBasket());
    this.cdr.detectChanges();
  });

  protected readonly calendarOptions = computed<CalendarOptions | undefined>(
    () =>
      !this.eventContent()
        ? undefined
        : {
            plugins: [resourceTimeGridPlugin, interactionPlugin],
            events: [
              {
                title: 'Meeting',
                start: new Date(),
                resourceId: 'day-1',
                className: 'pure-container',
                end: new Date().setHours(new Date().getHours() + 4),
                extendedProps: {
                  // poi,
                },
              },
            ],
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            initialView: 'resourceTimeGridDay',
            slotLabelFormat: {
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
              hour12: false,
            },
            headerToolbar: false,
            allDaySlot: false,
            editable: true,
            eventStartEditable: true,
            eventResourceEditable: true,
            eventDurationEditable: false,
            droppable: true,
            eventContent: this.eventContent(),
            resources: [
              {
                id: 'day-1',
                title: '12.12.2024',
              },
              {
                id: 'day-3',
                title: '14.12.2024',
              },
              {
                id: 'day-4',
                title: '15.12.2024',
              },
              {
                id: 'day-5',
                title: '16.12.2024',
              },
              {
                id: 'day-6',
                title: '19.12.2024',
              },
              {
                id: 'day-7',
                title: '22.12.2024',
              },
            ],
          },
  );

  constructor() {
    this.store.dispatch(poiActions.loadPois());
  }

  public async toggleSidenavs(): Promise<void> {
    this.sidenavContainer().start?.toggle();
    await this.sidenavContainer().end?.toggle();
    this.fullCalendar().getApi().render();
  }
}
