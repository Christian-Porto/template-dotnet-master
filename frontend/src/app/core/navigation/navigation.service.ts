import { Injectable, inject } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChatsClient, ProfileEnum } from '../../../../api-client';
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
    private _chatsClient: ChatsClient = inject(ChatsClient);

    constructor(private authService: AuthService) {}

    private buildNavigationFor(profile?: ProfileEnum | null): Navigation {
        const isAdmin = profile === ProfileEnum.Administrator;
        const isMonitor = profile === ProfileEnum.Monitor;

        let items: FuseNavigationItem[];

        if (isAdmin) {
            // Admin: full navigation
            items = horizontalNavigation.map((i) => ({ ...i }));
        } else if (isMonitor) {
            // Monitor: show Admin group but hide "users" entry
            items = horizontalNavigation.map((i) => {
                if (i.id !== 'admin') {
                    return { ...i } as FuseNavigationItem;
                }
                return {
                    ...i,
                    children: (i.children ?? []).filter((c) => c.id !== 'users'),
                } as FuseNavigationItem;
            });
        } else {
            // Others (e.g., Student or unauthenticated): hide Admin group entirely
            items = horizontalNavigation
                .filter((i) => i.id !== 'admin')
                .map((i) => ({ ...i }));
        }

        return {
            default: items,
            compact: null,
            futuristic: null,
            horizontal: items,
        } as Navigation;
    }

    get navigation$(): Observable<Navigation> {
        // If no token, hide admin by default
        if (!this.authService.accessToken) {
            return of(this.buildNavigationFor(null));
        }

        return this._chatsClient.getMe().pipe(
            map(user => this.buildNavigationFor(user?.profile ?? null)),
            catchError(() => of(this.buildNavigationFor(null)))
        );
    }
}
