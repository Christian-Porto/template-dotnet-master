import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ChatService } from './chat.service';
import { ChatComponent } from './chat.component';
import { ChatsComponent } from './chats/chats.component';
import { EmptyConversationComponent } from './empty-conversation/empty-conversation.component';
import { ConversationComponent } from './conversation/conversation.component';

/**
 * Conversation resolver for existing chat
 *
 * @param route
 * @param state
 */
const chatResolver = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const chatService = inject(ChatService);
    const router = inject(Router);

    try {
        const chatId = parseInt(route.paramMap.get('id'), 10);
        const chat = chatService.getChatById(chatId);

        if (!chat) {
            throw new Error('Chat not found');
        }

        return chat;
    } catch (error) {
        // Log the error
        console.error(error);

        // Get the parent url
        const parentUrl = state.url.split('/').slice(0, -2).join('/');

        // Navigate to there
        router.navigateByUrl(parentUrl);

        // Throw an error
        throw error;
    }
};

/**
 * Contact conversation resolver for new chat
 *
 * @param route
 * @param state
 */
const contactResolver = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const chatService = inject(ChatService);
    const router = inject(Router);

    try {
        const contactId = parseInt(route.paramMap.get('id'), 10);
        return await chatService.getChatByContactId(contactId);
    } catch (error) {
        // Log the error
        console.error(error);

        // Get the parent url
        const parentUrl = state.url.split('/').slice(0, -2).join('/');

        // Navigate to there
        router.navigateByUrl(parentUrl);

        // Throw an error
        throw error;
    }
};

/**
 * Chat data resolver
 * Ensures contacts are loaded before chats to properly map contact information
 */
const chatDataResolver = async () => {
    const chatService = inject(ChatService);

    // Load profile and contacts first
    await Promise.all([
        chatService.getProfile().toPromise(),
        chatService.getContacts().toPromise(),
    ]);

    // Then load chats (which needs contacts to be already loaded)
    await chatService.getChats().toPromise();

    return true;
};

export default [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            data: chatDataResolver,
        },
        children: [
            {
                path: '',
                component: ChatsComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: EmptyConversationComponent,
                    },
                    {
                        path: 'chat/:id',
                        component: ConversationComponent,
                        resolve: {
                            conversation: chatResolver,
                        },
                    },
                    {
                        path: 'contact/:id',
                        component: ConversationComponent,
                        resolve: {
                            conversation: contactResolver,
                        },
                    },
                ],
            },
        ],
    },
] as Routes;
