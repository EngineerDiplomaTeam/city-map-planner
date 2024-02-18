import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserAccountComponent } from './manage-user-account.component';

describe('ManageUserAccountComponent', () => {
  let component: ManageUserAccountComponent;
  let fixture: ComponentFixture<ManageUserAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUserAccountComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
