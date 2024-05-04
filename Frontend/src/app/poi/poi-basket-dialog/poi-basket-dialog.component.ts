import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { selectAllPois } from '../poi.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { poiActions } from '../poi.actions';
import { RouterLink } from '@angular/router';
import { MatDialogClose } from '@angular/material/dialog';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragSortEvent,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { PointOfInterest } from '../poi.reducer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TimeRangePickerComponent } from '../../time-range-picker/time-range-picker.component';
import { ToUrlPipe } from './to-url.pipe';
import { ToHeightPipe } from './to-height.pipe';
import { ToDurationPipe } from './to-duration.pipe';

@Component({
  selector: 'app-poi-basket-dialog',
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatDialogClose,
    MatFormFieldModule,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TimeRangePickerComponent,
    ToUrlPipe,
    ToHeightPipe,
    ToDurationPipe,
  ],
  templateUrl: './poi-basket-dialog.component.html',
  styleUrl: './poi-basket-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiBasketDialogComponent {
  protected readonly store = inject(Store);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly poisInBasket = this.store.selectSignal(selectAllPois);
  protected readonly poiActions = poiActions;
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

  protected unassignedPois: PointOfInterest[] = [];

  protected readonly addInitialUnassignedPoisEffect = effect(() => {
    // TODO: Filter out these that are assigned
    this.unassignedPois = structuredClone(this.poisInBasket());
    this.cdr.detectChanges();
  });

  protected readonly days = signal([
    {
      title: '12.12.2024',
      slots: Array.from({ length: 48 }).map((v, i) => ({
        id: i,
        occupied: Math.random() > 0.8,
      })),
    },
    {
      title: '13.12.2024',
      slots: [],
    },
  ]);

  drop(event: CdkDragDrop<any[]>) {
    console.log(event);

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  public addTimespan(): void {
    console.log(this.formGroup.errors);
  }
}
