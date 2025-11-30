import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparatiiComponent } from './comparatii.component';

describe('ComparatiiComponent', () => {
  let component: ComparatiiComponent;
  let fixture: ComponentFixture<ComparatiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparatiiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparatiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
