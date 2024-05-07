import { ComponentStore } from '@ngrx/component-store';
import { EventInput } from '@fullcalendar/core';
import { inject, Injectable } from '@angular/core';
import { ResourceInput } from '@fullcalendar/resource';
import { Store } from '@ngrx/store';
import { selectAllPois } from '../poi.selectors';
import {
  PoiSightseeingDaysManageDialogComponent,
  PoiSightseeingDaysManageDialogData,
  SightseeingTimeSpan,
} from '../poi-sightseeing-days-manage-dialog/poi-sightseeing-days-manage-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from 'date-fns';
import { firstValueFrom, Observable, of, tap } from 'rxjs';

export interface Range<T> {
  from: T;
  to: T;
}

type TimeSpansMap = Map<string, Range<string>[]>;

interface PoiScheduleState {
  events: EventInput[];
  resources: ResourceInput[];
  sightseeingTimeSpans: TimeSpansMap;
}

@Injectable({
  providedIn: 'root',
})
export class PoiScheduleStore extends ComponentStore<PoiScheduleState> {
  public static readonly dateOnlyFormat = 'MM/dd/yyyy';
  public static readonly defaultDateOnly = formatDate(
    new Date(),
    PoiScheduleStore.dateOnlyFormat,
  );
  public static readonly defaultTimeFrom = formatDate(new Date(), 'HH:mm');
  public static readonly defaultTimeTo = '23:59';

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
  ]);

  private readonly matDialog = inject(MatDialog);
  private readonly store = inject(Store);
  protected readonly poisInBasket = this.store.select(selectAllPois);
  public readonly events = this.selectSignal((x) => x.events);
  public readonly resources = this.selectSignal((x) => x.resources);
  public readonly sightseeingTimeSpans = this.selectSignal(
    (x) => x.sightseeingTimeSpans,
  );

  public static calculateEventsFromTimeSpans(
    timeSpans: TimeSpansMap,
  ): EventInput[] {
    return [
      {
        resourceId: 'day-1',
        groupId: 'availableForMeeting',
        start: '2024-05-06T10:00:00',
        end: '2024-05-06T18:00:00',
        display: 'background',
      },
    ];
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

  constructor() {
    super({
      sightseeingTimeSpans: PoiScheduleStore.initialSightseeingTimeSpans,
      events: PoiScheduleStore.calculateEventsFromTimeSpans(
        PoiScheduleStore.initialSightseeingTimeSpans,
      ),
      resources: PoiScheduleStore.calculateResourcesFromTimeSpans(
        PoiScheduleStore.initialSightseeingTimeSpans,
      ),
    });
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
  }
}
