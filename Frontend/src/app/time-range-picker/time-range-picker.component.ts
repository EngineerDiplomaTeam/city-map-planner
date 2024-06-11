import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { provideTimeOnlyDateAdapter } from './time-only-date-adapter';
import {
  NgxMatTimepickerComponent,
  NgxMatTimepickerModule,
} from 'ngx-mat-timepicker';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-time-range-picker',
  standalone: true,
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconButton,
    MatIconModule,
    ReactiveFormsModule,
    NgxMatTimepickerModule,
  ],
  providers: [provideTimeOnlyDateAdapter()],

  templateUrl: './time-range-picker.component.html',
  styleUrl: './time-range-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeRangePickerComponent {
  public formControlStart = input.required<FormControl<string>>();
  public formControlEnd = input.required<FormControl<string>>();

  protected readonly range = computed(
    () =>
      new FormGroup({
        start: this.formControlStart(),
        end: this.formControlEnd(),
      }),
  );

  protected readonly timePickerStart = viewChild.required('timePickerStart', {
    read: NgxMatTimepickerComponent,
  });

  protected readonly timePickerEnd = viewChild.required('timePickerEnd', {
    read: NgxMatTimepickerComponent,
  });

  public async openTimePicker(): Promise<void> {
    this.timePickerStart().open();
    await firstValueFrom(this.timePickerStart().closed);
    this.range().controls.start.setValue(this.timePickerStart().time);

    this.timePickerEnd().open();
    await firstValueFrom(this.timePickerEnd().closed);
    this.range().controls.end.setValue(this.timePickerEnd().time);
  }
}
