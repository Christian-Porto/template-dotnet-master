import { ProfileEnum } from '../../../../api-client';

export interface Profile {
    id?: number;
    name?: string;
    email?: string;
    avatar?: string;
    about?: string;
}

export interface Contact {
    id?: number;
    name?: string;
    profile?: ProfileEnum;
}

export interface Message {
    id?: number;
    chatId?: number;
    senderId?: number;
    content?: string;
    createdAtUtc?: string;
}

export interface Chat {
    id?: number;
    contactId?: number;
    contact?: Contact;
    unreadCount?: number;
    muted?: boolean;
    lastMessage?: string;
    lastMessageAt?: string;
    messages?: Message[];
}

