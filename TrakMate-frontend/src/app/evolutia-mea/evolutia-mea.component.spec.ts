import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutiaMeaComponent } from './evolutia-mea.component';

describe('EvolutiaMeaComponent', () => {
  let component: EvolutiaMeaComponent;
  let fixture: ComponentFixture<EvolutiaMeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutiaMeaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvolutiaMeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
