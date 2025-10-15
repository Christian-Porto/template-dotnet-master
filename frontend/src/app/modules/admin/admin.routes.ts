import { Routes } from '@angular/router';

export default [
    { path: 'users', loadChildren: () => import('app/modules/admin/users/users.routes') },
    { path: 'events', loadChildren: () => import('app/modules/admin/events/events.routes') },
] as Routes;
