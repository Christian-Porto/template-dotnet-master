import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { ChatMessageResponse } from '../../../../api-client';

export interface ChatResponse {
    id: number;
    userAId: number;
    userBId: number;
    messages: ChatMessageResponse[];
}

@Injectable({
    providedIn: 'root',
})
export class ChatSignalRService {
    private hubConnection: HubConnection | null = null;
    private _messageReceived = new Subject<ChatMessageResponse>();
    private _connectionState = new BehaviorSubject<HubConnectionState>(
        HubConnectionState.Disconnected
    );

    public messageReceived$: Observable<ChatMessageResponse> =
        this._messageReceived.asObservable();
    public connectionState$: Observable<HubConnectionState> =
        this._connectionState.asObservable();

    constructor() {}

    /**
     * Start the SignalR connection
     */
    public async startConnection(token: string): Promise<void> {
        if (
            this.hubConnection?.state === HubConnectionState.Connected ||
            this.hubConnection?.state === HubConnectionState.Connecting
        ) {
            return;
        }

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.apiBaseUrl}/hubs/chat`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.on(
            'ReceiveMessage',
            (message: ChatMessageResponse) => {
                this._messageReceived.next(message);
            }
        );

        this.hubConnection.onreconnecting(() => {
            this._connectionState.next(HubConnectionState.Reconnecting);
        });

        this.hubConnection.onreconnected(() => {
            this._connectionState.next(HubConnectionState.Connected);
        });

        this.hubConnection.onclose(() => {
            this._connectionState.next(HubConnectionState.Disconnected);
        });

        try {
            await this.hubConnection.start();
            this._connectionState.next(HubConnectionState.Connected);
            console.log('SignalR Connected');
        } catch (err) {
            console.error('Error while starting SignalR connection: ', err);
            this._connectionState.next(HubConnectionState.Disconnected);
            throw err;
        }
    }

    /**
     * Stop the SignalR connection
     */
    public async stopConnection(): Promise<void> {
        if (this.hubConnection) {
            try {
                await this.hubConnection.stop();
                this._connectionState.next(HubConnectionState.Disconnected);
                console.log('SignalR Disconnected');
            } catch (err) {
                console.error('Error while stopping SignalR connection: ', err);
            }
        }
    }

    /**
     * Start or get a chat with another user
     */
    public async startOrGetChat(otherUserId: number): Promise<ChatResponse> {
        if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
            throw new Error('SignalR connection is not established');
        }

        try {
            const chat = await this.hubConnection.invoke<ChatResponse>(
                'StartOrGetChat',
                otherUserId
            );
            return chat;
        } catch (err) {
            console.error('Error starting or getting chat: ', err);
            throw err;
        }
    }

    /**
     * Send a message through SignalR
     */
    public async sendMessage(
        chatId: number,
        content: string
    ): Promise<void> {
        if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
            throw new Error('SignalR connection is not established');
        }

        try {
            await this.hubConnection.invoke('SendMessage', chatId, content);
        } catch (err) {
            console.error('Error sending message: ', err);
            throw err;
        }
    }

    /**
     * Check if connection is active
     */
    public isConnected(): boolean {
        return this.hubConnection?.state === HubConnectionState.Connected;
    }
}
