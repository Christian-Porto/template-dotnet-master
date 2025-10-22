import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';


const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'events',
        title: 'Eventos',
        type: 'basic',
        icon: 'heroicons_outline:ticket',
        link: '/events'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id: 'users',
                title: 'Usuários',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: 'admin/users'
            },
            {
                id: 'eventos',
                title: 'Eventos',
                type: 'basic',
                icon: 'heroicons_outline:ticket',
                link: 'admin/events'
            }
        ]
    }
];


@Injectable({ providedIn: 'root' })
export class NavigationService {

    constructor(private authService: AuthService) {}

    get navigation$(): Observable<Navigation> {
        return of(<Navigation>{
            default: null,
            compact: null,
            futuristic: null,
            horizontal: horizontalNavigation
        });
    }
}
