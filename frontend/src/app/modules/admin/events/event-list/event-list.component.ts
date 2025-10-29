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
import { PaginatedListOfEventResponse, EventResponse } from 'app/modules/events/models/event.model';
import { EventsService } from '../services/events.service';
import { finalize, debounceTime } from 'rxjs';
import { StatusPipe } from 'app/modules/events/pipes/Status.pipe';
import { StatusEnumPipe } from '../pipes/Status.pipe';
import { EventTypeEnumPipe } from '../pipes/EventTypeEnum.pipe';
import { RouterLink } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
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
        StatusPipe,
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
        query: new FormControl<string>(''),
        status: new FormControl<StatusEnum | null>(null),
        type: new FormControl<EventTypeEnum | null>(null),
    });

    StatusEnum = StatusEnum;
    EventTypeEnum = EventTypeEnum;

    constructor(
        private readonly eventsService: EventsService,
        private readonly fuseConfirmationService: FuseConfirmationService,
        private readonly toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.loadEvents();

        this.form.valueChanges
            .pipe(debounceTime(300))
            .subscribe(() => {
                this.pageIndex = 0;
                this.loadEvents();
            });
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

    toggleEventStatus(eventItem: EventResponse): void {
        if (!eventItem?.id) return;
        const willDisable = (eventItem.isActive ?? true);
        const dialogRef = this.fuseConfirmationService.open({
            title: willDisable ? 'Confirmação de Cancelamento' : 'Confirmação de Restauração',
            message: willDisable
                ? 'Você tem certeza que deseja cancelar este evento? Ele deixará de aparecer nas listagens.'
                : 'Você tem certeza que deseja restaurar este evento? Ele voltará a aparecer nas listagens.',
            actions: {
                confirm: {
                    label: willDisable ? 'Sim, cancelar evento' : 'Sim, restaurar evento',
                    color: willDisable ? 'warn' : 'primary',
                },
                cancel: {
                    label: 'Voltar',
                },
            },
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'accent',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const desired = !(eventItem.isActive ?? true);
                const prev = eventItem.isActive ?? true;
                // Optimistic update
                eventItem.isActive = desired;
                this.eventsService.updateEventStatus(eventItem.id!, desired).subscribe({
                    next: (updated) => {
                        eventItem.isActive = updated.isActive ?? desired;
                        if (desired === false) {
                            this.toastr.success('Evento cancelado com sucesso');
                        } else {
                            this.toastr.success('Evento restaurado com sucesso');
                        }
                    },
                    error: () => {
                        eventItem.isActive = prev;
                    }
                });
            }
        });
    }
}
