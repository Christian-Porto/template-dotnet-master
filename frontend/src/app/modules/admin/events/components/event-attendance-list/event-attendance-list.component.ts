import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegistrationResponse } from '../../../../../../../api-client';
import { EventResponse } from 'app/modules/events/models/event.model';
import { EventsService } from '../../services/events.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';

export interface RegistrationWithUser extends RegistrationResponse {
    userName?: string;
    userEnrollment?: string;
}

export interface PaginatedListOfRegistrationWithUser {
    items?: RegistrationWithUser[];
    pageIndex?: number;
    totalPages?: number;
    totalCount?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
}

@Component({
    selector: 'app-event-attendance-list',
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        RouterLink
    ],
    templateUrl: './event-attendance-list.component.html',
    styleUrl: './event-attendance-list.component.scss'
})
export class EventAttendanceListComponent implements OnDestroy {
    event: EventResponse | null = null;
    registrations: PaginatedListOfRegistrationWithUser | null = null;
    loading: boolean = false;
    pageIndex: number = 0;
    pageSize: number = 25;
    displayedColumns: string[] = ['name', 'enrollment', 'attended', 'justification'];
    private justificationSubject = new Subject<{ id: number; justification: string }>();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly eventsService: EventsService
    ) {
        this.justificationSubject
            .pipe(
                debounceTime(600),
                distinctUntilChanged((prev, curr) =>
                    prev.id === curr.id && prev.justification === curr.justification
                )
            )
            .subscribe(({ id, justification }) => {
                this.saveJustification(id, justification);
            });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const eventId = Number(params.get('id'));
            if (eventId) {
                this.loading = true;
                this.eventsService.getEventById(eventId).subscribe({
                    next: event => {
                        this.event = event;
                    }
                });
                this.eventsService.listAttendances(eventId, this.pageIndex, this.pageSize).subscribe({
                    next: registrations => {
                        this.registrations = <unknown>registrations;
                        this.loading = false;
                    },
                    error: () => {
                        this.loading = false;
                    }
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.justificationSubject.complete();
    }

    onAttendanceChange(registration: RegistrationWithUser, attended: boolean): void {
        console.log('Alterar presença:', registration.id, 'para', attended);
        // TODO: Implementar chamada à API
        // this.registrationService.updateAttendance(registration.id!, { attended }).subscribe({
        //   next: () => {
        //     registration.attended = attended;
        //     // Mostrar mensagem de sucesso
        //   },
        //   error: (error) => {
        //     // Reverter checkbox em caso de erro
        //     registration.attended = !attended;
        //     // Mostrar mensagem de erro
        //   }
        // });
    }

    onJustificationChange(registrationId: number, justification: string): void {
        this.justificationSubject.next({ id: registrationId, justification });
    }

    private saveJustification(registrationId: number, justification: string): void {
        console.log('Salvar justificativa:', registrationId, justification);
        // TODO: Implementar chamada à API
        // this.registrationService.updateAttendance(registrationId, { justification }).subscribe({
        //   next: () => {
        //     // Mostrar mensagem de sucesso (opcional)
        //   },
        //   error: (error) => {
        //     // Mostrar mensagem de erro
        //   }
        // });
    }

    onPageChange(event: PageEvent): void {
        // Emitir evento para o componente pai
        console.log('Página alterada:', event);
    }
}
