import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { ChatsClient, ProfileEnum } from '../../../../../api-client';
import { catchError, map, of } from 'rxjs';

export const RoleGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);
    const chatsClient: ChatsClient = inject(ChatsClient);

    const allowed: ProfileEnum[] = (route.data?.['roles'] as ProfileEnum[]) ?? [];

    return chatsClient.getMe().pipe(
        map((user) => {
            if (!allowed.length) {
                return true;
            }

            const profile = user?.profile as ProfileEnum | undefined;

            if (profile !== undefined && allowed.includes(profile)) {
                return true;
            }

            return router.parseUrl('/events');
        }),
        catchError(() => of(router.parseUrl('/events')))
    );
};

