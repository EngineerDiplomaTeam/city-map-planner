import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
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
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { ToDurationPipe } from '../poi-basket-dialog/to-duration.pipe';
import { ToHeightPipe } from '../poi-basket-dialog/to-height.pipe';
import { ToUrlPipe } from '../poi-basket-dialog/to-url.pipe';
import { PointOfInterest } from '../poi.reducer';
import { selectAllPois } from '../poi.selectors';
import { Store } from '@ngrx/store';
import { poiActions } from '../poi.actions';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
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

@Component({
  selector: 'app-poi-schedule',
  standalone: true,
  providers: [PoiScheduleStore],
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
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly poiScheduleStore = inject(PoiScheduleStore);
  protected readonly today = new Date();

  protected readonly formGroup = this.formBuilder.group({
    dateOnly: new FormControl(new Date(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    timeFrom: new FormControl<string>('13:37', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    timeTo: new FormControl<string>('21:37', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  protected readonly calendarOptions = computed<CalendarOptions | undefined>(
    () =>
      !this.eventContent()
        ? undefined
        : {
            plugins: [resourceTimeGridPlugin, interactionPlugin],
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            initialView: 'resourceTimeGridDay',
            slotLabelFormat: {
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
              hour12: false,
            },
            eventOverlap: false,
            headerToolbar: false,
            allDaySlot: false,
            editable: true,
            eventStartEditable: true,
            eventResourceEditable: true,
            eventDurationEditable: false,
            droppable: true,
            eventContent: this.eventContent(),
          },
  );

  protected readonly dragableUnassignedPoisEffect = effect(() => {
    console.log(this.dragableUnassignedPois());

    const draggable = new Draggable(
      this.dragableUnassignedPois().nativeElement,
      {
        itemSelector: 'app-poi-event',
      },
    );
  });

  constructor() {
    this.store.dispatch(poiActions.loadPois());
  }

  public async toggleSidenavs(): Promise<void> {
    this.sidenavContainer().start?.toggle();
    await this.sidenavContainer().end?.toggle();
    this.fullCalendar().getApi().render();
  }
}
