import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventRegistrationListComponent } from './components/event-registration-list/event-registration-list.component';
import { EventAttendanceListComponent } from './components/event-attendance-list/event-attendance-list.component';
import { EventEditComponent } from './event-edit/event-edit.component';

export default [
    {
        path: '',
        component: EventListComponent,
    },
    {
        path: 'create',
        component: EventEditComponent,
    },
    {
        path: ':id',
        component: EventEditComponent,
    },
    {
        path: ':id/registrations',
        component: EventRegistrationListComponent,
    },
    {
        path: ':id/attendances',
        component: EventAttendanceListComponent,
    }
] as Routes;
