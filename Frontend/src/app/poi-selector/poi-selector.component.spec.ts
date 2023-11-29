import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiSelectorComponent } from './poi-selector.component';
import { MockDirective } from 'ng-mocks';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';

describe('PoiSelectorComponent', () => {
  let component: PoiSelectorComponent;
  let fixture: ComponentFixture<PoiSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiSelectorComponent],
      providers: [MockDirective(LeafletDirective)],
    }).compileComponents();

    fixture = TestBed.createComponent(PoiSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
