import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatedListOfRegistrationResponse, RegistrationResponse, RegistrationStatusEnum } from '../../../../../../../api-client';
import { EventResponse } from 'app/modules/events/models/event.model';
import { EventsService } from '../../services/events.service';
import { MatButtonModule } from '@angular/material/button';

// name, enrollment, cpf and period already come from RegistrationResponse

@Component({
    selector: 'app-event-registration-list',
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        RouterLink
    ],
    templateUrl: './event-registration-list.component.html',
    styleUrl: './event-registration-list.component.scss'
})
export class EventRegistrationListComponent implements OnDestroy {
    event: EventResponse | null = null;
    registrations: PaginatedListOfRegistrationResponse | null = null;
    loading: boolean = false;
    pageIndex: number = 0;
    pageSize: number = 25;
    displayedColumns: string[] = ['name', 'enrollment', 'cpf', 'period', 'participationsCount', 'status'];

    RegistrationStatusEnum = RegistrationStatusEnum;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly eventsService: EventsService
    ) { }

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
                this.eventsService.listRegistrations(eventId, this.pageIndex, this.pageSize).subscribe({
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
    }

    onStatusChange(registration: RegistrationResponse, status: RegistrationStatusEnum): void {
        console.log('Alterar status:', registration.id, 'para', status);

    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        if (this.event?.id) {
            this.loading = true;
            this.eventsService.listRegistrations(this.event.id, this.pageIndex, this.pageSize).subscribe({
                next: registrations => {
                    this.registrations = registrations;
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
        }
    }
}
