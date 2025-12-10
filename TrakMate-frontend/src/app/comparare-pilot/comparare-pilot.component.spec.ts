import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararePilotComponent } from './comparare-pilot.component';

describe('CompararePilotComponent', () => {
  let component: CompararePilotComponent;
  let fixture: ComponentFixture<CompararePilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompararePilotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompararePilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
