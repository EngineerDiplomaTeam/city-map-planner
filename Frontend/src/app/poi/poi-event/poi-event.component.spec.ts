import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiEventComponent } from './poi-event.component';
import { MockProvider } from 'ng-mocks';
import { PoiScheduleStore } from '../poi-schedule/poi-schedule.store';

describe('PoiEventComponent', () => {
  let component: PoiEventComponent;
  let fixture: ComponentFixture<PoiEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiEventComponent],
      providers: [MockProvider(PoiScheduleStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(PoiEventComponent);
    fixture.componentRef.setInput('poi', {
      details: {},
      preferredSightseeingTime: '',
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
