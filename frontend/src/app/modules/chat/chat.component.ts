import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './chat.service';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet],
})
export class ChatComponent implements OnInit, OnDestroy {
    private _chatService = inject(ChatService);
    private _authService = inject(AuthService);

    /**
     * Constructor
     */
    constructor() {}

    /**
     * On init
     */
    ngOnInit(): void {
        // Initialize SignalR connection
        const token = this._authService.accessToken;
        if (token) {
            this._chatService.initializeSignalR(token);
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Disconnect SignalR
        this._chatService.disconnectSignalR();
    }
}
