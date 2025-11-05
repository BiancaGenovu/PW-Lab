import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimpCircuitComponent } from './timp-circuit.component';

describe('TimpCircuitComponent', () => {
  let component: TimpCircuitComponent;
  let fixture: ComponentFixture<TimpCircuitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimpCircuitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimpCircuitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
