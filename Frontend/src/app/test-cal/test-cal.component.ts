import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-test-cal',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './test-cal.component.html',
  styleUrl: './test-cal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestCalComponent {
  protected readonly eventContent = viewChild.required('eventContent', {
    read: TemplateRef,
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
            headerToolbar: false,
            footerToolbar: false,
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            initialView: 'resourceTimeGridDay',
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
            ],
          },
  );
}
