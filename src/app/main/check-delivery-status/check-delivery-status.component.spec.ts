import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDeliveryStatusComponent } from './check-delivery-status.component';

describe('CheckDeliveryStatusComponent', () => {
  let component: CheckDeliveryStatusComponent;
  let fixture: ComponentFixture<CheckDeliveryStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckDeliveryStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDeliveryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
