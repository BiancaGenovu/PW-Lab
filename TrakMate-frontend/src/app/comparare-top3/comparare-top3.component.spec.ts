import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparareTop3Component } from './comparare-top3.component';

describe('ComparareTop3Component', () => {
  let component: ComparareTop3Component;
  let fixture: ComponentFixture<ComparareTop3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparareTop3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparareTop3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
