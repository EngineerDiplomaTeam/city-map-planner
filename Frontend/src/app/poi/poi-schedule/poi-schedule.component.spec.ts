import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiScheduleComponent } from './poi-schedule.component';

describe('PoiScheduleComponent', () => {
  let component: PoiScheduleComponent;
  let fixture: ComponentFixture<PoiScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoiScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
