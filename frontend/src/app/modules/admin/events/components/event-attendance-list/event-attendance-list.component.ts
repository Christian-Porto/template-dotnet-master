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
import { PaginatedListOfRegistrationResponse, RegistrationResponse } from '../../../../../../../api-client';
import { EventResponse } from 'app/modules/events/models/event.model';
import { EventsService } from '../../services/events.service';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';

// Using RegistrationResponse fields directly (name, enrollment)

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
    registrations: PaginatedListOfRegistrationResponse | null = null;
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
                distinctUntilChanged((prev, curr) => prev.id === curr.id && prev.justification === curr.justification),
                switchMap(({ id, justification }) => {
                    const payload = { justification: justification?.trim() ? justification.trim() : undefined } as {
                        justification?: string;
                    };
                    return this.eventsService.updateAttendance(id, payload).pipe(
                        tap((updated) => {
                            const items = this.registrations?.items ?? [];
                            const idx = items.findIndex(r => r.id === id);
                            if (idx >= 0) {
                                items[idx].justification = updated.justification ?? payload.justification ?? '';
                            }
                        }),
                        catchError(() => of(null))
                    );
                })
            )
            .subscribe();
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
                        this.registrations = registrations;
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

    get canMarkAttendance(): boolean {
        if (!this.event?.eventDate) {
            return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(this.event.eventDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() < today.getTime();
    }

    get attendanceBlockedReason(): string {
        return 'A presença só pode ser marcada após a data do evento.';
    }

    toggleAttendance(registration: RegistrationResponse, attended: boolean): void {
        if (!registration?.id) return;
        if (!this.canMarkAttendance) return;
        const prevAttended = registration.attended ?? false;
        const prevJustification = registration.justification ?? '';

        registration.attended = attended;
        if (attended) {
            registration.justification = '';
        }
        this.loading = true;
        this.eventsService.updateAttendance(registration.id, {
            attended,
            justification: registration.justification ?? undefined,
        }).subscribe({
            next: (updated) => {
                registration.attended = updated.attended ?? attended;
                registration.justification = updated.justification ?? registration.justification;
                this.loading = false;
            },
            error: () => {
                registration.attended = prevAttended;
                registration.justification = prevJustification;
                this.loading = false;
            }
        });
    }

    onJustificationChange(registrationId: number, justification: string): void {
        if (!this.canMarkAttendance) return;
        this.justificationSubject.next({ id: registrationId, justification });
    }

    onPageChange(event: PageEvent): void {
        // Emitir evento para o componente pai
        console.log('Página alterada:', event);
    }
}
