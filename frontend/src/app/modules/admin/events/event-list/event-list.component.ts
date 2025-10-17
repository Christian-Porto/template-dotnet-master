import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { StatusEnum, EventTypeEnum } from '../../../../../../api-client';
import { PaginatedListOfEventResponse } from 'app/modules/events/models/event.model';
import { EventsService } from '../services/events.service';
import { finalize } from 'rxjs';
import { StatusEnumPipe } from '../pipes/Status.pipe';
import { EventTypeEnumPipe } from '../pipes/EventTypeEnum.pipe';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-event-list',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatTableModule,
        MatSnackBarModule,
        MatDividerModule,
        MatRadioModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatTabsModule,
        MatSidenavModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatLuxonDateModule,
        MatMenuModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        StatusEnumPipe,
        EventTypeEnumPipe,
        RouterLink
    ],
    templateUrl: './event-list.component.html',
    styleUrl: './event-list.component.scss'
})
export class EventListComponent {
    pageIndex: number = 0;
    pageSize: number = 25;

    loading: boolean = false;

    events: PaginatedListOfEventResponse | null = null;

    displayedColumns: string[] = ['name', 'status', 'type', 'datails'];

    form: FormGroup = new FormGroup({
        name: new FormControl<string>(''),
        status: new FormControl<StatusEnum | null>(null),
        type: new FormControl<EventTypeEnum | null>(null),
    });

    StatusEnum = StatusEnum;
    EventTypeEnum = EventTypeEnum;

    constructor(private readonly eventsService: EventsService) { }

    ngOnInit(): void {
        this.loadEvents();
    }

    loadEvents(): void {
        this.loading = true;
        this.eventsService.listEvents(this.pageIndex, this.pageSize, this.form.value)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (events) => {
                    this.events = events;
                }
            });
    }

    pageEvent(event?: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        window.scrollTo(0, 0);

        this.loadEvents();
    }
}
