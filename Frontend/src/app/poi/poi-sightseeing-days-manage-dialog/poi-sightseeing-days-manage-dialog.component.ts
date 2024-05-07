import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TimeRangePickerComponent } from '../../time-range-picker/time-range-picker.component';
import { MatInput } from '@angular/material/input';
import {
  MatButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { formatDate } from 'date-fns';
import { PoiScheduleStore } from '../poi-schedule/poi-schedule.store';
import { first } from 'rxjs';

export interface SightseeingTimeSpan {
  dateOnly: string;
  timeFrom: string;
  timeTo: string;
}

export interface PoiSightseeingDaysManageDialogData {
  sightseeingTimeSpans: SightseeingTimeSpan[];
}

type TimeSpanFormGroup = FormGroup<{
  dateOnly: FormControl<Date>;
  timeFrom: FormControl<string>;
  timeTo: FormControl<string>;
}>;

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
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconButton,
    MatIcon,
    MatMiniFabButton,
  ],
  templateUrl: './poi-sightseeing-days-manage-dialog.component.html',
  styleUrl: './poi-sightseeing-days-manage-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiSightseeingDaysManageDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<PoiSightseeingDaysManageDialogComponent>,
  );

  private readonly data =
    inject<PoiSightseeingDaysManageDialogData>(DIALOG_DATA);
  protected readonly today = new Date();

  protected readonly formArray = new FormArray<TimeSpanFormGroup>(
    this.data.sightseeingTimeSpans.map(this.mapTimeSpanToFormGroup),
  );

  constructor() {
    this.dialogRef
      .beforeClosed()
      .pipe(first())
      .subscribe(() => {
        const returnValue = this.mapFormArrayToTimeSpan(this.formArray);
        this.dialogRef.close(returnValue);
      });
  }

  private mapTimeSpanToFormGroup(
    timeSpan: SightseeingTimeSpan,
  ): TimeSpanFormGroup {
    return new FormGroup({
      dateOnly: new FormControl(new Date(timeSpan.dateOnly), {
        validators: [Validators.required],
        nonNullable: true,
      }),
      timeFrom: new FormControl<string>(timeSpan.timeFrom, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      timeTo: new FormControl<string>(timeSpan.timeTo, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  private mapFormArrayToTimeSpan(
    formArray: FormArray<TimeSpanFormGroup>,
  ): SightseeingTimeSpan[] {
    return formArray.controls.map((x) => ({
      dateOnly: formatDate(
        x.controls.dateOnly.value,
        PoiScheduleStore.dateOnlyFormat,
      ),
      timeFrom: x.controls.timeFrom.value,
      timeTo: x.controls.timeTo.value,
    }));
  }

  public addTimeSpan(): void {
    const group = new FormGroup({
      dateOnly: new FormControl(this.today, {
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

    this.formArray.push(group);
  }

  public removeTimeSpan(index: number): void {
    this.formArray.removeAt(index);
  }
}
