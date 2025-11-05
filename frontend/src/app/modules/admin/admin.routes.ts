import { Routes } from '@angular/router';
import { RoleGuard } from 'app/core/auth/guards/role.guard';
import { ProfileEnum } from '../../../../api-client';

export default [
    {
        path: 'users',
        canActivate: [RoleGuard],
        data: { roles: [ProfileEnum.Administrator] },
        loadChildren: () => import('app/modules/admin/users/users.routes'),
    },
    { path: 'events', loadChildren: () => import('app/modules/admin/events/events.routes') },
] as Routes;
