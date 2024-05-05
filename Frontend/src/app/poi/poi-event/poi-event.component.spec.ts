import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiEventComponent } from './poi-event.component';

describe('PoiEventComponent', () => {
  let component: PoiEventComponent;
  let fixture: ComponentFixture<PoiEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoiEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
