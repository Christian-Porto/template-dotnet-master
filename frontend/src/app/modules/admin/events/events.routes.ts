import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { EventsComponent } from './events.component';

export default [
    {
        path: '',
        component: EventsComponent,
    },
] as Routes;
