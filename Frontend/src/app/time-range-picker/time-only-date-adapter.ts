/* eslint-disable @typescript-eslint/no-unused-vars */
import { DateAdapter } from '@angular/material/core';
import { Provider } from '@angular/core';

const EMPTY_STRING = '';

const isValidTime = (time: string): boolean => {
  const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
  return timePattern.test(time);
};

abstract class NoOpDateAdapter extends DateAdapter<string> {
  override getYear(date: string): number {
    return 0;
  }
  override getMonth(date: string): number {
    return 0;
  }
  override getDate(date: string): number {
    return 0;
  }
  override getDayOfWeek(date: string): number {
    return 0;
  }
  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return [];
  }
  override getDateNames(): string[] {
    return [];
  }
  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return [];
  }
  override getYearName(date: string): string {
    return EMPTY_STRING;
  }
  override getFirstDayOfWeek(): number {
    return 0;
  }
  override getNumDaysInMonth(date: string): number {
    return 0;
  }
  override clone(date: string): string {
    return `${date}`;
  }
  override createDate(year: number, month: number, date: number): string {
    return EMPTY_STRING;
  }
  override today(): string {
    return EMPTY_STRING;
  }
  override parse(value: unknown, parseFormat: unknown): string | null {
    return `${value}`;
  }
  override format(date: string, displayFormat: unknown): string {
    return date;
  }
  override addCalendarYears(date: string, years: number): string {
    return date;
  }
  override addCalendarMonths(date: string, months: number): string {
    return date;
  }
  override addCalendarDays(date: string, days: number): string {
    return date;
  }
  override toIso8601(date: string): string {
    return EMPTY_STRING;
  }
  override isDateInstance(obj: unknown): boolean {
    return true;
  }
  override isValid(date: string): boolean {
    return true;
  }
  override invalid(): string {
    return EMPTY_STRING;
  }
}

class TimeOnlyDateAdapter extends NoOpDateAdapter {
  override isValid(date: string): boolean {
    return isValidTime(date);
  }
}

export const provideTimeOnlyDateAdapter = (): Provider => ({
  provide: DateAdapter,
  useClass: TimeOnlyDateAdapter,
});
