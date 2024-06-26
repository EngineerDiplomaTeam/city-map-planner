import { ComponentStore } from '@ngrx/component-store';
import { EventChangeArg, EventInput } from '@fullcalendar/core';
import { inject, Injectable } from '@angular/core';
import { ResourceInput } from '@fullcalendar/resource';
import { Store } from '@ngrx/store';
import { selectPoisInBasket } from '../poi.selectors';
import {
  PoiSightseeingDaysManageDialogComponent,
  PoiSightseeingDaysManageDialogData,
  SightseeingTimeSpan,
} from '../poi-sightseeing-days-manage-dialog/poi-sightseeing-days-manage-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from 'date-fns';
import { firstValueFrom, Observable, of, tap } from 'rxjs';
import { PointOfInterest } from '../poi.reducer';
import { EventReceiveArg } from '@fullcalendar/interaction';
import { IdToColorPipe } from '../id-to-color.pipe';

export interface Range<T> {
  from: T;
  to: T;
}

type TimeSpansMap = Map<string, Range<string>[]>;

interface PoiScheduleState {
  events: EventInput[];
  eventGroups: EventInput[];
  resources: ResourceInput[];
  sightseeingTimeSpans: TimeSpansMap;
}

function getTimeRange(startDate: Date, endDate: Date): string {
  const diff = Math.abs(endDate.getTime() - startDate.getTime());

  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(
    2,
    '0',
  );
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function get0BasedDayOfWeek(date: string): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  const zeroBased = [6, 0, 1, 2, 3, 4, 5];
  return zeroBased[new Date(date).getDay()] as 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

function greater(timeFrom: string, time: string): string {
  return timeFrom > time ? timeFrom : time;
}

function smaller(timeTo: string, time: string): string {
  return timeTo < time ? timeTo : time;
}

@Injectable({
  providedIn: 'root',
})
export class PoiScheduleStore extends ComponentStore<PoiScheduleState> {
  private static id = 0;
  public static readonly dateOnlyFormat = 'yyyy-MM-dd';
  public static readonly defaultDateOnly = formatDate(
    new Date(),
    PoiScheduleStore.dateOnlyFormat,
  );
  public static readonly defaultTimeFrom = '10:00';
  public static readonly defaultTimeTo = '20:00';

  private static readonly initialSightseeingTimeSpans = new Map<
    string,
    Range<string>[]
  >([
    [
      PoiScheduleStore.defaultDateOnly,
      [
        {
          from: PoiScheduleStore.defaultTimeFrom,
          to: PoiScheduleStore.defaultTimeTo,
        },
      ],
    ],
    [
      formatDate(
        new Date().setDate(new Date().getDate() + 1),
        PoiScheduleStore.dateOnlyFormat,
      ),
      [
        {
          from: PoiScheduleStore.defaultTimeFrom,
          to: PoiScheduleStore.defaultTimeTo,
        },
      ],
    ],
    [
      formatDate(
        new Date().setDate(new Date().getDate() + 2),
        PoiScheduleStore.dateOnlyFormat,
      ),
      [
        {
          from: PoiScheduleStore.defaultTimeFrom,
          to: PoiScheduleStore.defaultTimeTo,
        },
      ],
    ],
  ]);

  private readonly matDialog = inject(MatDialog);
  private readonly store = inject(Store);
  protected readonly poisInBasket$ = this.store.select(selectPoisInBasket);
  protected readonly poisInBasket = this.store.selectSignal(selectPoisInBasket);
  public readonly events = this.selectSignal((x) =>
    x.events.concat(x.eventGroups),
  );
  public readonly resources = this.selectSignal((x) => x.resources);
  public readonly sightseeingTimeSpans = this.selectSignal(
    (x) => x.sightseeingTimeSpans,
  );

  public readonly scheduledEvents = this.selectSignal(
    (x) =>
      x.events as (EventInput & {
        extendedProps: { poi: PointOfInterest };
        start: string;
        end: string;
      })[],
  );

  public static calculateEventGroupsFromTimeSpans(
    timeSpans: TimeSpansMap,
    pois: PointOfInterest[],
  ): EventInput[] {
    const resources = Array.from(timeSpans.entries()); // It is a date string
    return resources
      .flatMap(([resourceId, resourceRange]) =>
        pois.flatMap((poi) =>
          poi.businessHours
            .filter(
              (x) =>
                new Date(x.effectiveFrom.split('T')[0]) <=
                  new Date(resourceId) &&
                new Date(x.effectiveTo.split('T')[0]) >= new Date(resourceId),
            )
            .filter((x) => x.state == 0)
            .filter((x) =>
              x.effectiveDays.includes(get0BasedDayOfWeek(resourceId)),
            )
            .flatMap((businessHour) => [
              {
                resourceId,
                groupId: `poi-${poi.id}-indicator`,
                start: `${PoiScheduleStore.defaultDateOnly}T${businessHour.timeFrom}`,
                end: `${PoiScheduleStore.defaultDateOnly}T${businessHour.timeTo}`,
                editable: false,
                eventStartEditable: false,
                eventResourceEditable: false,
                display: 'background',
                classNames: [
                  `poi-business-hours-${IdToColorPipe.getColorForId(poi.id)}`,
                ],
              },
              ...resourceRange.map((range) => ({
                resourceId,
                groupId: `poi-${poi.id}`,
                start: `${PoiScheduleStore.defaultDateOnly}T${greater(
                  businessHour.timeFrom,
                  range.from + ':00',
                )}`,
                end: `${PoiScheduleStore.defaultDateOnly}T${smaller(
                  businessHour.timeTo,
                  range.to + ':00',
                )}`,
                editable: false,
                eventStartEditable: false,
                eventResourceEditable: false,
                display: 'none',
              })),
            ]),
        ),
      )
      .filter((x) => x.start < x.end);
  }

  public static calculateResourcesFromTimeSpans(
    timeSpans: TimeSpansMap,
  ): ResourceInput[] {
    return Array.from(timeSpans.entries()).map(([dateOnly, ranges]) => ({
      id: dateOnly,
      title: dateOnly,
      businessHours: ranges.map(({ from, to }) => ({
        startTime: from,
        endTime: to,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6, 7], // Hack to ignore current date as we use resources as dates
      })),
    }));
  }

  private readonly recalculateResourcesEffect = this.effect(
    (timeSpans$: Observable<TimeSpansMap>) =>
      timeSpans$.pipe(
        tap((timeSpans) => {
          const resources =
            PoiScheduleStore.calculateResourcesFromTimeSpans(timeSpans);

          this.patchState(() => ({ resources }));
        }),
      ),
  );

  private readonly recalculateEventsGroupsEffect = this.effect(
    (timeSpans$: Observable<TimeSpansMap>) =>
      timeSpans$.pipe(
        tap((timeSpans) => {
          const eventGroups =
            PoiScheduleStore.calculateEventGroupsFromTimeSpans(
              timeSpans,
              this.poisInBasket(),
            );

          this.patchState(() => ({ eventGroups }));
        }),
      ),
  );

  constructor() {
    super({
      sightseeingTimeSpans: PoiScheduleStore.initialSightseeingTimeSpans,
      events: [],
      eventGroups: [],
      resources: [],
    });

    this.recalculateResourcesEffect(
      of(PoiScheduleStore.initialSightseeingTimeSpans),
    );

    this.recalculateEventsGroupsEffect(
      of(PoiScheduleStore.initialSightseeingTimeSpans),
    );

    this.poisInBasket$.subscribe(() =>
      this.recalculateEventsGroupsEffect(of(this.state().sightseeingTimeSpans)),
    );
  }

  public async manageSightSeeingDays(): Promise<void> {
    const currentSightseeingTimeSpans: SightseeingTimeSpan[] = Array.from(
      this.sightseeingTimeSpans().entries(),
    ).flatMap(([dateOnly, ranges]) =>
      ranges.map(({ from, to }) => ({
        dateOnly,
        timeFrom: from,
        timeTo: to,
      })),
    );

    const ref = this.matDialog.open<
      PoiSightseeingDaysManageDialogComponent,
      PoiSightseeingDaysManageDialogData
    >(PoiSightseeingDaysManageDialogComponent, {
      data: {
        sightseeingTimeSpans: currentSightseeingTimeSpans,
      },
    });

    const nextSightSeeingTimeSpans: SightseeingTimeSpan[] =
      await firstValueFrom(ref.afterClosed());

    const rangeCompatible = nextSightSeeingTimeSpans.map((x) => ({
      dateOnly: x.dateOnly,
      from: x.timeFrom,
      to: x.timeTo,
    }));

    const newMap = Map.groupBy(rangeCompatible, (x) => x.dateOnly);

    this.patchState(() => ({
      sightseeingTimeSpans: newMap,
    }));

    this.recalculateResourcesEffect(of(newMap));
    this.recalculateEventsGroupsEffect(of(newMap));
  }

  public eventReceive({ event }: EventReceiveArg): void {
    const poi = event.extendedProps['poi'] as PointOfInterest | undefined;
    if (!poi) return;

    const [resource] = event.getResources();

    const mapped: EventInput = {
      id: `${PoiScheduleStore.id++}`,
      title: poi.map.label,
      duration: poi.preferredSightseeingTime,
      editable: true,
      extendedProps: { poi },
      classNames: ['pure-container'],
      constraint: poi.businessHours.length ? `poi-${poi.id}` : 'businessHours',
      start: event.startStr,
      end: event.endStr,
      resourceId: resource.id,
    };

    this.patchState((state) => ({
      events: state.events.concat(mapped),
    }));
  }

  public eventChange({ event }: EventChangeArg): void {
    const poi = event.extendedProps['poi'] as PointOfInterest | undefined;
    if (!poi) return;

    const [resource] = event.getResources();

    const duration =
      event.start && event.end
        ? getTimeRange(event.start ?? new Date(), event.end ?? new Date())
        : poi.preferredSightseeingTime;

    const mapped: EventInput = {
      id: event.id,
      title: poi.map.label,
      duration: duration,
      extendedProps: { poi },
      classNames: ['pure-container'],
      constraint: poi.businessHours.length ? `poi-${poi.id}` : 'businessHours',
      start: event.startStr,
      end: event.endStr,
      resourceId: resource.id,
    };

    this.patchState((state) => ({
      events: state.events.filter((x) => x.id !== mapped.id).concat(mapped),
    }));
  }

  public removeEvent(id: string): void {
    this.patchState((state) => ({
      events: state.events.filter((x) => x.id !== id),
    }));
  }
}
