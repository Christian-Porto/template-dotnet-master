import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';

export default [
    {
        path: '',
        component: UserListComponent,
    },
    {
        path: 'create',
        component: UserEditComponent,
    },
    {
        path: ':id',
        component: UserEditComponent,
    }
] as Routes;
