import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiManageComponent } from './poi-manage.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PoiManageComponent', () => {
  let component: PoiManageComponent;
  let fixture: ComponentFixture<PoiManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoiManageComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PoiManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
