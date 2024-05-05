import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCalComponent } from './test-cal.component';

describe('TestCalComponent', () => {
  let component: TestCalComponent;
  let fixture: ComponentFixture<TestCalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
