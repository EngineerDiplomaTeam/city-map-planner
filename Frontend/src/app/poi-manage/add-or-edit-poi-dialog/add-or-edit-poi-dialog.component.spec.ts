import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditPoiDialogComponent } from './add-or-edit-poi-dialog.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ManageablePoi } from '../poi-manage.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddOrEditPoiDialogComponent', () => {
  let component: AddOrEditPoiDialogComponent;
  let fixture: ComponentFixture<AddOrEditPoiDialogComponent>;
  const poi: ManageablePoi = {
    businessTimes: [],
    description: '',
    entrances: [],
    images: [],
    name: '',
    preferredSightseeingTime: '',
    preferredWmoCodes: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditPoiDialogComponent, HttpClientTestingModule],
      providers: [
        {
          provide: DIALOG_DATA,
          useValue: { poi },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddOrEditPoiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
