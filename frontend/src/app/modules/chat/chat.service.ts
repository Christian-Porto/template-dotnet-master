import { Injectable, inject } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    map,
    tap,
    catchError,
    of,
    switchMap,
    filter,
    take,
} from 'rxjs';
import { Chat, Contact, Profile, Message } from './chat.types';
import {
    ChatsClient,
    ChatUserResponse,
    SendMessageCommand,
    ChatMessageResponse,
    ChatResponse as ApiChatResponse,
} from '../../../../api-client';
import { ChatSignalRService, ChatResponse } from './chat-signalr.service';
import { UserService } from 'app/core/user/user.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
    private _chat: BehaviorSubject<Chat | null> = new BehaviorSubject<Chat | null>(null);
    private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
    private _contact: BehaviorSubject<Contact | null> = new BehaviorSubject<Contact | null>(null);
    private _contacts: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
    private _profile: BehaviorSubject<Profile | null> = new BehaviorSubject<Profile | null>(null);
    private _unreadTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private _chatsClient = inject(ChatsClient);
    private _signalRService = inject(ChatSignalRService);
    private _userService = inject(UserService);

    constructor() {
        // Subscribe to incoming messages
        this._signalRService.messageReceived$.subscribe((message) => {
            this._handleIncomingMessage(message);
        });
    }

    get chat$(): Observable<Chat | null> {
        return this._chat.asObservable();
    }

    get chats$(): Observable<Chat[]> {
        return this._chats.asObservable();
    }

    get contact$(): Observable<Contact | null> {
        return this._contact.asObservable();
    }

    get contacts$(): Observable<Contact[]> {
        return this._contacts.asObservable();
    }

    get profile$(): Observable<Profile | null> {
        return this._profile.asObservable();
    }

    get unreadTotal$(): Observable<number> {
        return this._unreadTotal.asObservable();
    }

    /**
     * Initialize SignalR connection
     */
    async initializeSignalR(token: string): Promise<void> {
        try {
            await this._signalRService.startConnection(token);
        } catch (error) {
            console.error('Failed to initialize SignalR:', error);
        }
    }

    /**
     * Clear all chat state (used on sign-out or user switch)
     */
    clearState(): void {
        try {
            // Clear in-memory state
            this._chats.next([]);
            this._chat.next(null);
            this._contacts.next([]);
            this._contact.next(null);
            this._profile.next(null);
            this._unreadTotal.next(0);

            // Clear local unread tracking
            try {
                localStorage.removeItem(this._storageKey());
            } catch {
                // ignore storage errors
            }
        } catch {
            // no-op
        }
    }

    /**
     * Get chats from backend
     */
    getChats(): Observable<Chat[]> {
        return this._chatsClient.listChats().pipe(
            map((chatResponses: ApiChatResponse[]) => {
                // Map each chat response to Chat type
                const chats = chatResponses.map((chatResponse) => {
                    const currentUserId = this._profile.value?.id;
                    const otherUserId = chatResponse.userAId === currentUserId
                        ? chatResponse.userBId
                        : chatResponse.userAId;

                    // Find the contact for this chat
                    const contact = this._contacts.value.find((c) => c.id === otherUserId);

                    const lastMessage = chatResponse.messages?.length > 0
                        ? chatResponse.messages[chatResponse.messages.length - 1]
                        : null;

                    return {
                        id: chatResponse.id,
                        contactId: otherUserId,
                        contact: contact,
                        unreadCount: 0,
                        muted: false,
                        lastMessage: lastMessage?.content || '',
                        lastMessageAt: lastMessage?.createdAtUtc
                            ? (typeof lastMessage.createdAtUtc === 'string' ? lastMessage.createdAtUtc : (lastMessage.createdAtUtc as any).toISOString())
                            : new Date().toISOString(),
                        messages: chatResponse.messages?.map((m) => ({
                            id: m.id,
                            chatId: m.chatId,
                            senderId: m.senderId,
                            content: m.content,
                            createdAtUtc: typeof m.createdAtUtc === 'string' ? m.createdAtUtc : (m.createdAtUtc as any).toISOString(),
                        })) || [],
                    };
                });

                return chats;
            }),
            tap((chats: Chat[]) => {
                this._chats.next(chats);
                this._recomputeUnreadTotal();
            }),
            catchError((error) => {
                return of([]);
            })
        );
    }

    /**
     * Get contact by ID (from users list)
     */
    getContact(id: number): Observable<Contact | null> {
        const contact = this._contacts.value.find((c) => c.id === id);
        if (contact) {
            this._contact.next(contact);
            return of(contact);
        }
        return of(null);
    }

    /**
     * Get contacts (users available for chat)
     */
    getContacts(): Observable<Contact[]> {
        return this._chatsClient.listUsers().pipe(
            map((users: ChatUserResponse[]) => {
                return users.map((user) => ({
                    id: user.id,
                    name: user.name,
                    profile: user.profile,
                }));
            }),
            tap((contacts: Contact[]) => {
                this._contacts.next(contacts);

                // Update existing chats with contact information
                this._updateChatsWithContacts(contacts);
            }),
            catchError((error) => {
                console.error('Error loading contacts:', error);
                return of([]);
            })
        );
    }

    /**
     * Get profile from chat API
     */
    getProfile(): Observable<Profile> {
        // Get profile from chat API
        return this._chatsClient.getMe().pipe(
            map((chatUser: ChatUserResponse) => {
                const profile: Profile = {
                    id: chatUser.id,
                    name: chatUser.name,
                    email: '', // Chat API doesn't return email
                };
                return profile;
            }),
            tap((profile: Profile) => {
                this._profile.next(profile);
            }),
            catchError((error) => {
                console.error('Error loading profile:', error);
                // Fallback: create a default profile
                const fallbackProfile: Profile = {
                    id: 0,
                    name: 'User',
                    email: '',
                };
                this._profile.next(fallbackProfile);
                return of(fallbackProfile);
            })
        );
    }

    /**
     * Get chat by contact ID (start or get existing chat)
     */
    async getChatByContactId(contactId: number): Promise<Chat> {
        try {
            const chatResponse: ChatResponse = await this._signalRService.startOrGetChat(contactId);
            const contact = this._contacts.value.find((c) => c.id === contactId);

            const chat: Chat = this._mapChatResponseToChat(chatResponse, contact);

            // Add to chats list if not exists
            const chats = this._chats.value;
            const existingIndex = chats.findIndex((c) => c.id === chat.id);

            if (existingIndex >= 0) {
                chats[existingIndex] = chat;
            } else {
                chats.push(chat);
            }

            this._chats.next([...chats]);
            this._chat.next(chat);
            // Mark as read when opening the chat
            this.markChatRead(chat.id);

            return chat;
        } catch (error) {
            console.error('Error getting chat:', error);
            throw error;
        }
    }

    /**
     * Get chat by chat ID (from existing chats)
     */
    getChatById(chatId: number): Chat | null {
        const chat = this._chats.value.find((c) => c.id === chatId);
        if (chat) {
            this._chat.next(chat);
            // Mark as read when selecting the chat
            this.markChatRead(chat.id);
            return chat;
        }
        return null;
    }

    /**
     * Send message via SignalR
     */
    async sendMessageViaSignalR(chatId: number, content: string): Promise<void> {
        await this._signalRService.sendMessage(chatId, content);
    }

    /**
     * Send message via API (fallback)
     */
    sendMessageViaAPI(otherUserId: number, content: string): Observable<ChatMessageResponse> {
        const command = new SendMessageCommand({
            otherUserId: otherUserId,
            content: content,
        });

        return this._chatsClient.sendMessage(command);
    }

    /**
     * Update chat (for muting, etc.)
     */
    updateChat(chat: Chat): void {
        const chats = this._chats.value;
        const index = chats.findIndex((c) => c.id === chat.id);

        if (index >= 0) {
            chats[index] = chat;
            this._chats.next([...chats]);
        }

        if (this._chat.value?.id === chat.id) {
            this._chat.next(chat);
        }
    }

    /**
     * Reset chat
     */
    resetChat(): void {
        this._chat.next(null);
    }

    /**
     * Disconnect SignalR
     */
    async disconnectSignalR(): Promise<void> {
        await this._signalRService.stopConnection();
    }

    /**
     * Update existing chats with contact information
     */
    private _updateChatsWithContacts(contacts: Contact[]): void {
        const chats = this._chats.value;
        if (chats.length === 0) {
            return;
        }

        let updated = false;
        const updatedChats = chats.map((chat) => {
            if (!chat.contact && chat.contactId) {
                const contact = contacts.find((c) => c.id === chat.contactId);
                if (contact) {
                    updated = true;
                    return { ...chat, contact };
                }
            }
            return chat;
        });

        if (updated) {
            this._chats.next(updatedChats);
        }
    }

    /**
     * Handle incoming message from SignalR
     */
    private _handleIncomingMessage(message: ChatMessageResponse): void {
        const chats = this._chats.value;
        const chatIndex = chats.findIndex((c) => c.id === message.chatId);

        if (chatIndex >= 0) {
            const chat = chats[chatIndex];
            const createdAtUtc = typeof message.createdAtUtc === 'string'
                ? message.createdAtUtc
                : (message.createdAtUtc as any).toISOString();

            const newMessage: Message = {
                id: message.id,
                chatId: message.chatId,
                senderId: message.senderId,
                content: message.content,
                createdAtUtc: createdAtUtc,
            };

            if (!chat.messages) {
                chat.messages = [];
            }
            chat.messages.push(newMessage);
            chat.lastMessage = message.content;
            chat.lastMessageAt = createdAtUtc;

            // Ensure contact information is loaded
            if (!chat.contact && chat.contactId) {
                chat.contact = this._contacts.value.find((c) => c.id === chat.contactId);
            }

            chats[chatIndex] = { ...chat };
            this._chats.next([...chats]);

            // Update current chat if it's the same and mark as read
            if (this._chat.value?.id === message.chatId) {
                this._chat.next({ ...chat });
                this.markChatRead(message.chatId);
            }

            // Recompute unread after new message
            this._recomputeUnreadTotal();
        } else {
            // Chat not found in current list; refresh chats to include new message
            this.getChats().pipe(take(1)).subscribe(() => this._recomputeUnreadTotal());
        }
    }

    /**
     * Map ChatResponse to Chat
     */
    private _mapChatResponseToChat(chatResponse: ChatResponse, contact?: Contact): Chat {
        const currentUserId = this._profile.value?.id;
        const otherUserId = chatResponse.userAId === currentUserId
            ? chatResponse.userBId
            : chatResponse.userAId;

        const lastMessage = chatResponse.messages?.length > 0
            ? chatResponse.messages[chatResponse.messages.length - 1]
            : null;

        return {
            id: chatResponse.id,
            contactId: otherUserId,
            contact: contact,
            unreadCount: 0,
            muted: false,
            lastMessage: lastMessage?.content || '',
            lastMessageAt: lastMessage?.createdAtUtc
                ? (typeof lastMessage.createdAtUtc === 'string' ? lastMessage.createdAtUtc : (lastMessage.createdAtUtc as any).toISOString())
                : new Date().toISOString(),
            messages: chatResponse.messages?.map((m) => ({
                id: m.id,
                chatId: m.chatId,
                senderId: m.senderId,
                content: m.content,
                createdAtUtc: typeof m.createdAtUtc === 'string' ? m.createdAtUtc : (m.createdAtUtc as any).toISOString(),
            })) || [],
        };
    }

    // -------------------------------------------------------------
    // Unread tracking helpers
    // -------------------------------------------------------------
    private _storageKey(): string {
        return 'chat:lastReadMap';
    }

    private _loadLastReadMap(): Record<string, number> {
        try {
            const raw = localStorage.getItem(this._storageKey());
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    private _saveLastReadMap(map: Record<string, number>): void {
        try {
            localStorage.setItem(this._storageKey(), JSON.stringify(map));
        } catch {
            // ignore storage errors
        }
    }

    private _getLastReadId(chatId: number): number {
        const map = this._loadLastReadMap();
        return map[String(chatId)] ?? 0;
    }

    private _setLastReadId(chatId: number, messageId: number): void {
        const map = this._loadLastReadMap();
        map[String(chatId)] = messageId || 0;
        this._saveLastReadMap(map);
    }

    markChatRead(chatId: number): void {
        const chat = this._chats.value.find((c) => c.id === chatId);
        if (!chat) {
            return;
        }
        const lastMessageId = chat.messages?.length
            ? (chat.messages[chat.messages.length - 1].id || 0)
            : 0;
        this._setLastReadId(chatId, lastMessageId);
        this._recomputeUnreadTotal();
    }

    private _recomputeUnreadTotal(): void {
        const currentUserId = this._profile.value?.id;
        const chats = this._chats.value || [];
        let total = 0;
        let changed = false;
        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            const lastReadId = this._getLastReadId(chat.id);
            const unread = (chat.messages || []).filter(
                (m) => (m.id || 0) > lastReadId && m.senderId !== currentUserId
            ).length;
            if (chat.unreadCount !== unread) {
                chats[i] = { ...chat, unreadCount: unread };
                changed = true;
            }
            total += unread;
        }
        this._unreadTotal.next(total);
        if (changed) {
            this._chats.next([...chats]);
        }
    }
}

