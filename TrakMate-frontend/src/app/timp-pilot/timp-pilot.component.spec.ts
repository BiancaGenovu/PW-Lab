import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimpPilotComponent } from './timp-pilot.component';

describe('TimpPilotComponent', () => {
  let component: TimpPilotComponent;
  let fixture: ComponentFixture<TimpPilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimpPilotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimpPilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
