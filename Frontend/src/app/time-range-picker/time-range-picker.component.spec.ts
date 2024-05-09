import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangePickerComponent } from './time-range-picker.component';
import { FormControl } from '@angular/forms';
import { provideTimeOnlyDateAdapter } from './time-only-date-adapter';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('TimeRangePickerComponent', () => {
  let component: TimeRangePickerComponent;
  let fixture: ComponentFixture<TimeRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeRangePickerComponent],
      providers: [provideTimeOnlyDateAdapter(), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeRangePickerComponent);
    fixture.componentRef.setInput('formControlStart', new FormControl());
    fixture.componentRef.setInput('formControlEnd', new FormControl());
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
