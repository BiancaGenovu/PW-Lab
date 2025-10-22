import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitesComponent } from './circuites.component';

describe('CircuitesComponent', () => {
  let component: CircuitesComponent;
  let fixture: ComponentFixture<CircuitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircuitesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircuitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
