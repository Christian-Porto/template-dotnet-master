import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';

export default [
    {
        path: '',
        component: EventListComponent,
    },
    {
        path: ':id',
        component: EventDetailsComponent,
    },
] as Routes;
