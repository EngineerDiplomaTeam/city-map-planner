import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTwoFactorAuthComponent } from './manage-two-factor-auth.component';

describe('ManageTwoFactorAuthComponent', () => {
  let component: ManageTwoFactorAuthComponent;
  let fixture: ComponentFixture<ManageTwoFactorAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTwoFactorAuthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTwoFactorAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
