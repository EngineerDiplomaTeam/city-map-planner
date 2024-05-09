import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiSummaryComponent } from './poi-summary.component';

describe('PoiSummaryComponent', () => {
  let component: PoiSummaryComponent;
  let fixture: ComponentFixture<PoiSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoiSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
