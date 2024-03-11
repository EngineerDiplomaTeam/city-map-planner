import { OlMapDirective } from './ol-map.directive';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockProviders } from 'ng-mocks';

describe('OlMapDirective', () => {
  let directive: OlMapDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OlMapDirective, MockProviders(ElementRef, ChangeDetectorRef)],
    });
    directive = TestBed.inject(OlMapDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
