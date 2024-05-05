import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDatepickerModule,
  MatRangeDateSelectionModel,
} from '@angular/material/datepicker';
import { TimeRangePickerComponent } from '../../time-range-picker/time-range-picker.component';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-poi-sightseeing-days-manage-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    TimeRangePickerComponent,
    ReactiveFormsModule,
    MatInput,
    MatButton,
  ],
  templateUrl: './poi-sightseeing-days-manage-dialog.component.html',
  styleUrl: './poi-sightseeing-days-manage-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiSightseeingDaysManageDialogComponent {
  protected readonly formBuilder = inject(FormBuilder);
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
}
