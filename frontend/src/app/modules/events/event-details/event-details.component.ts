import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService } from '../services/events.service';
import { EventResponse, EventTypeEnum, Status, FormatShiftsPipe, RegistrationStatusEnum } from '../models/event.model';
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
        MatRippleModule, RouterLink, FormatShiftsPipe, MatTooltipModule],
    templateUrl: './event-details.component.html',
    styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {
    eventId: number | null = null;
    event: EventResponse | null = null;

    loading: boolean = false;
    myRegistrationStatus: RegistrationStatusEnum | null = null;

    Status = Status;
    EventTypeEnum = EventTypeEnum;
    constructor(
        private readonly eventsService: EventsService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly fuseConfirmationService: FuseConfirmationService,
        private readonly toastr: ToastrService,
    ) { }

    get canInscrever(): boolean {
        // Pode inscrever-se apenas se evento está aberto e ainda não possui inscrição
        return !this.loading && this.event?.status === Status.b && this.myRegistrationStatus === null;
    }

    get canCancelar(): boolean {
        // Pode cancelar apenas quando ainda está como "Inscrito" (sem seleção)
        return !this.loading && this.myRegistrationStatus === RegistrationStatusEnum.Registered;
    }

    get cancelarDisabledReason(): string | null {
        if (this.myRegistrationStatus === RegistrationStatusEnum.Selected) {
            return 'Sua inscrição foi aprovada, o cancelamento não está disponível.';
        }
        if (this.myRegistrationStatus === RegistrationStatusEnum.NotSelected) {
            return 'Sua inscrição não foi aprovada, não há cancelamento a realizar.';
        }
        return null;
    }

    ngOnInit(): void {
        this.eventId = +this.route.snapshot.paramMap.get('id');
        this.getEvent();
        if (this.eventId) {
            this.eventsService.getMyRegistrationStatus(this.eventId).subscribe((v) => this.myRegistrationStatus = v);
        }
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
        if (!this.canInscrever) {
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
                            this.toastr.success('Inscrição realizada com sucesso');
                            this.myRegistrationStatus = RegistrationStatusEnum.Registered;
                            this.router.navigate(['/events']);
                        }
                    });
            }
        });
    }

    onCancel(): void {
        if (!this.canCancelar) {
            return;
        }

        const dialogRef = this.fuseConfirmationService.open({
            title: "Confirmação de Cancelamento",
            message: "Você tem certeza que deseja cancelar sua inscrição neste evento?",
            actions: {
                confirm: {
                    label: "Sim, cancelar inscrição",
                    color: 'warn',
                },
                cancel: {
                    label: "Manter inscrição",
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
                    .cancelRegistration(this.eventId)
                    .pipe(finalize(() => this.loading = false))
                    .subscribe({
                        next: () => {
                            this.toastr.success('Inscrição cancelada com sucesso');
                            this.myRegistrationStatus = null;
                            this.router.navigate(['/events']);
                        }
                    });
            }
        });
    }
}
