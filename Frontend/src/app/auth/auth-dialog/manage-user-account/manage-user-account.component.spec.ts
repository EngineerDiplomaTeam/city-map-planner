import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserAccountComponent } from './manage-user-account.component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProviders } from 'ng-mocks';
import { AuthService } from '../../auth.service';
import { AUTH_FEATURE_KEY } from '../../auth.reducer';

describe('ManageUserAccountComponent', () => {
  let component: ManageUserAccountComponent;
  let fixture: ComponentFixture<ManageUserAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUserAccountComponent],
      providers: [
        provideMockStore({
          initialState: { [AUTH_FEATURE_KEY]: { user: undefined } },
        }),
        MockProviders(AuthService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
