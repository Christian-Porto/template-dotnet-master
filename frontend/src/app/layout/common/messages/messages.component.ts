import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    NgZone,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { NgIf } from '@angular/common';
import { ChatService } from 'app/modules/chat/chat.service';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'messages',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatBadgeModule,
        NgIf,
        RouterLink,
    ],
})
export class MessagesComponent implements OnInit {
    unreadTotal = 0;
    badgeLabel: string | number = 0;

    constructor(
        private _chatService: ChatService,
        private _authService: AuthService,
        private _cdr: ChangeDetectorRef,
        private _ngZone: NgZone,
    ) {}

    ngOnInit(): void {
        // Initialize realtime connection if possible
        const token = this._authService.accessToken;
        if (token) {
            this._chatService.initializeSignalR(token).catch(() => {/* ignore */});
        }

        // Prime chat data so we can compute unread counts even outside chat views
        this._chatService.getProfile().subscribe({
            next: () => {
                // Load contacts then chats; ignore errors silently
                this._chatService.getContacts().subscribe({
                    next: () => this._chatService.getChats().subscribe(),
                    error: () => this._chatService.getChats().subscribe(),
                });
            },
            error: () => {
                // Still attempt to load chats
                this._chatService.getChats().subscribe();
            },
        });

        // Subscribe to unread total updates
        this._chatService.unreadTotal$
            .subscribe((total) => {
                // Ensure we are in Angular zone so change detection runs
                this._ngZone.run(() => {
                    this.unreadTotal = total ?? 0;
                    this.badgeLabel = (this.unreadTotal || 0) > 99 ? '99+' : this.unreadTotal;
                    // For OnPush components, ensure view updates
                    this._cdr.markForCheck();
                });
            });
    }
}
