import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { forkJoin } from 'rxjs';

export const initialDataResolver = () => {
    const messagesService = inject(MessagesService);
    const navigationService = inject(NavigationService);

    return forkJoin([
        navigationService.get(),
        messagesService.getAll(),
    ]);
};
