import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CevaComponent } from './ceva.component';

describe('CevaComponent', () => {
  let component: CevaComponent;
  let fixture: ComponentFixture<CevaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CevaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CevaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
