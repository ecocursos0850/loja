import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();
  });

  it('Should be return component as defined', () => {
    expect(component).toBeDefined();
  });
});
