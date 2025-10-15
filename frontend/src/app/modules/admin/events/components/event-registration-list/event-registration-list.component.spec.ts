import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRegistrationListComponent } from './event-registration-list.component';

describe('EventRegistrationListComponent', () => {
  let component: EventRegistrationListComponent;
  let fixture: ComponentFixture<EventRegistrationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventRegistrationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
