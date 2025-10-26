import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService } from '../services/events.service';
import { EventResponse, EventTypeEnum, Status, FormatShiftsPipe } from '../models/event.model';
import { finalize } from 'rxjs';
import { EventTypeEnumPipe } from "../pipes/EventTypeEnum.pipe";
import { DatePipe, NgClass } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { StatusPipe } from '../pipes/Status.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
    selector: 'app-event-details',
    imports: [EventTypeEnumPipe, StatusPipe, DatePipe, MatIcon, NgClass, MatProgressBarModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        NgClass,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatRippleModule, RouterLink, FormatShiftsPipe],
    templateUrl: './event-details.component.html',
    styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {
    eventId: number | null = null;
    event: EventResponse | null = null;

    loading: boolean = false;

    Status = Status;
    EventTypeEnum = EventTypeEnum;
    constructor(
        private readonly eventsService: EventsService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly fuseConfirmationService: FuseConfirmationService,
        private readonly toastr: ToastrService,
    ) { }

    get canRegister(): boolean {
        return !this.loading && this.event?.status === Status.b;
    }

    ngOnInit(): void {
        this.eventId = +this.route.snapshot.paramMap.get('id');

        this.getEvent();
    }

    getEvent() {
        this.loading = true;
        this.eventsService.getEventById(this.eventId!)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (event) => {
                    this.event = event;
                }
            });
    }

    onRegister(): void {
        if (!this.canRegister) {
            return;
        }

        const dialogRef = this.fuseConfirmationService.open({
            title: "Confirmação de Inscrição",
            message: "Você tem certeza que deseja se inscrever neste evento?",
            actions: {
                confirm: {
                    label: "Sim, Inscrever-me",
                    color: 'primary',
                },
                cancel: {
                    label: "Cancelar",
                },
            },
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'accent',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                if (!this.eventId || this.loading) return;
                this.loading = true;

                this.eventsService
                    .registerToEvent(this.eventId)
                    .pipe(finalize(() => this.loading = false))
                    .subscribe({
                        next: () => {
                            this.toastr.success('Cadastro realizado com sucesso');
                            this.router.navigate(['/events']);
                        }
                    });
            }
        });
    }
}
