import { Component } from '@angular/core';
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
export class EventRegistrationListComponent {
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


    get remainingSlots(): number {
        if (!this.event || !this.registrations?.items) {
            return 0;
        }
        const selectedCount = this.registrations.items.filter(
            reg => reg.status === RegistrationStatusEnum.Selected
        ).length;
        return Math.max(0, this.event.slots - selectedCount);
    }

    isEventDatePastOrToday(): boolean {
        const eventDate = this.event?.eventDate ? new Date(this.event.eventDate) : null;
        if (!eventDate) return false;
        const today = new Date();
        // Compare only the date (ignore time)
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        return today.getTime() >= eventDate.getTime();
    }

    onStatusChange(registration: RegistrationResponse, status: RegistrationStatusEnum): void {
        // Block status changes on or after the event date
        if (this.isEventDatePastOrToday()) {
            return;
        }
        if (!registration?.id) {
            return;
        }
        const previous = registration.status;
        registration.status = status;
        this.loading = true;
        this.eventsService.updateRegistrationStatus(registration.id, status).subscribe({
            next: (updated) => {
                // ensure local state reflects server response
                registration.status = updated.status ?? status;
                this.loading = false;
            },
            error: () => {
                // rollback on error
                registration.status = previous;
                this.loading = false;
            }
        });
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

    exportToCSV(): void {
        if (!this.event?.id || !this.registrations?.items) {
            return;
        }

        // Fetch all registrations for export
        this.loading = true;
        this.eventsService.listRegistrations(this.event.id, 0, this.registrations.totalCount || 1000).subscribe({
            next: allRegistrations => {
                this.generateCSV(allRegistrations.items || []);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    private generateCSV(data: RegistrationResponse[]): void {
        if (!data || data.length === 0) {
            return;
        }

        // CSV settings for pt-BR Excel compatibility
        const delimiter = ';';
        const EOL = '\r\n';
        const BOM = '\uFEFF';
        // Define CSV headers
        const headers = ['Nome', 'Matrícula', 'CPF', 'Período', 'Atividades Realizadas', 'Status'];

        // Convert data to CSV rows
        const mapStatus = (s?: RegistrationStatusEnum) => {
            switch (s) {
                case RegistrationStatusEnum.Selected:
                    return 'Selecionado';
                case RegistrationStatusEnum.NotSelected:
                    return 'Não Selecionado';
                case RegistrationStatusEnum.Registered:
                    return 'Inscrito';
                default:
                    return '-';
            }
        };
        const rows = data.map(item => [
            this.escapeCSVValue(item.name || '-'),
            this.escapeCSVValue(String(item.enrollment || '-')),
            this.escapeCSVValue(item.cpf || '-'),
            this.escapeCSVValue(String(item.period || '-')),
            (item.participationsCount || 0).toString(),
            mapStatus(item.status)
        ]);

        // Combine headers and rows
        const csvContent = BOM + [
            headers.join(delimiter),
            ...rows.map(row => row.join(delimiter))
        ].join(EOL) + EOL;

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        const fileName = `inscricoes_${this.event?.name?.replace(/\s+/g, '_') || 'evento'}_${new Date().toISOString().split('T')[0]}.csv`;

        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    private escapeCSVValue(value: string): string {
        if (!value) return '';
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
}
