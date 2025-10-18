import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuiteComponent } from './circuite.component';

describe('CircuiteComponent', () => {
  let component: CircuiteComponent;
  let fixture: ComponentFixture<CircuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircuiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
