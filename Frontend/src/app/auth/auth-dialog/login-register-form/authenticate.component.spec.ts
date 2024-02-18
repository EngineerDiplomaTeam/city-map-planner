import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticateComponent } from './authenticate.component';

describe('LoginRegisterFormComponent', () => {
  let component: AuthenticateComponent;
  let fixture: ComponentFixture<AuthenticateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
