import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from '../chat.service';
import { Contact } from '../chat.types';

@Component({
    selector: 'chat-new-chat',
    templateUrl: './new-chat.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatIconModule],
})
export class NewChatComponent implements OnInit, OnDestroy {
    @Input() drawer: MatDrawer;
    contacts: Contact[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Contacts
        this._chatService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Contact[]) => {
                this.contacts = contacts;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open chat with contact
     */
    async openChatWithContact(contact: Contact): Promise<void> {
        try {
            // Close the drawer
            this.drawer.close();

            // Navigate to the chat using 'contact' route
            await this._router.navigate(['/chat', 'contact', contact.id]);
        } catch (error) {
            console.error('Error opening chat:', error);
        }
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
