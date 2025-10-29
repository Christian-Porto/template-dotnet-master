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
                    const items = this.registrations?.items ?? [];
                    const idx = items.findIndex(r => r.id === id);
                    const reg = idx >= 0 ? items[idx] : undefined;

                    const trimmed = justification?.trim() ?? '';
                    const payload = {
                        // If user types a justification while not present, force attended=false
                        attended: (trimmed && (!reg || !reg.attended)) ? false : undefined,
                        justification: trimmed ? trimmed : undefined,
                    } as {
                        attended?: boolean;
                        justification?: string;
                    };

                    return this.eventsService.updateAttendance(id, payload).pipe(
                        tap((updated) => {
                            const list = this.registrations?.items ?? [];
                            const i = list.findIndex(r => r.id === id);
                            if (i >= 0) {
                                list[i].justification = (updated?.justification ?? payload.justification ?? '') as string;
                                if (payload.attended !== undefined || updated?.attended !== undefined) {
                                    list[i].attended = updated?.attended ?? payload.attended ?? list[i].attended;
                                }
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
            // Clear local justification when marking present
            registration.justification = '';
        }
        this.loading = true;
        this.eventsService.updateAttendance(registration.id, {
            attended,
            // When marking as present, send justification as null per requirement
            justification: attended ? null : (registration.justification?.trim() || undefined),
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
