import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CreateEventCommand, EventTypeEnum, ShiftEnum, StatusEnum, UpdateEventCommand } from '../../../../../../api-client';
import { EventTypeEnumPipe } from '../pipes/EventTypeEnum.pipe';
import { EventsService } from '../services/events.service';
import { ToastrService } from 'ngx-toastr';

export const BR_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MM/YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MM/YYYY',
    },
};

@Component({
    selector: 'app-event-edit',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        EventTypeEnumPipe,
        RouterLink,
    ],
    templateUrl: './event-edit.component.html',
    styleUrl: './event-edit.component.scss',
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        { provide: MAT_DATE_FORMATS, useValue: BR_DATE_FORMATS }
    ],
})
export class EventEditComponent implements OnInit {
    EventTypeEnum = EventTypeEnum;
    StatusEnum = StatusEnum;
    ShiftEnum = ShiftEnum;

    eventForm!: FormGroup;
    isEditMode = false;
    private eventId: number | null = null;
    private shiftCounter = 0;
    // Minimum selectable date (today at 00:00)
    minDate: Date = (() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    })();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder,
        private readonly eventsService: EventsService,
        private readonly router: Router,
        private readonly dateAdapter: DateAdapter<Date>,
        private readonly toastr: ToastrService,
    ) {
        this.dateAdapter.setLocale('pt-BR');
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!id;

        this.eventForm = this.fb.group(
            {
                name: ['', [Validators.required, Validators.maxLength(512)]],
                description: ['', [Validators.required, Validators.maxLength(8224)]],
                eventType: [null, Validators.required],
                eventDate: [null, Validators.required],
                startDate: [null, Validators.required],
                endDate: [null, Validators.required],
                slots: [null, [Validators.required, Validators.min(1)]],
                shifts: this.fb.array(
                    [],
                    [this.requiredShiftValidator(), Validators.maxLength(3), this.uniqueShiftsValidator()]
                ),
            },
            { validators: [this.dateConsistencyValidator()] }
        );
        if (this.isEditMode && id) {
            const eventIdNum = Number(id);
            this.eventId = isNaN(eventIdNum) ? null : eventIdNum;
            if (this.eventId !== null) {
                this.eventsService.getEventById(this.eventId).subscribe((ev) => {
                    this.fc.name.setValue(ev.name);
                    this.fc.description.setValue(ev.description);
                    this.fc.eventType.setValue(ev.type as EventTypeEnum);
                    this.fc.eventDate.setValue(new Date(ev.eventDate));
                    this.fc.startDate.setValue(new Date(ev.startDate));
                    this.fc.endDate.setValue(new Date(ev.endDate));
                    this.fc.slots.setValue(ev.slots);

                    // reset shifts
                    while (this.shiftsArray.length > 0) {
                        this.shiftsArray.removeAt(0);
                    }
                    this.shiftCounter = 0;
                    (ev.shifts || []).forEach((s) => {
                        this.shiftCounter++;
                        const group = this.fb.group({
                            id: [this.shiftCounter],
                            shift: [s, Validators.required],
                        });
                        this.shiftsArray.push(group);
                    });
                    this.shiftsArray.updateValueAndValidity();
                });
            }
        }
    }

    get fc() {
        return this.eventForm.controls as {
            name: FormControl<string | null>;
            description: FormControl<string | null>;
            eventType: FormControl<EventTypeEnum | null>;
            eventDate: FormControl<Date | null>;
            startDate: FormControl<Date | null>;
            endDate: FormControl<Date | null>;
            slots: FormControl<number | null>;
            shifts: FormArray;
        };
    }


    get shiftsArray(): FormArray {
        return this.fc.shifts as FormArray;
    }

    get canAddShift(): boolean {
        return this.shiftsArray.length < 3;
    }

    addShift(): void {
        if (!this.canAddShift) return;
        this.shiftCounter++;
        const group = this.fb.group({
            id: [this.shiftCounter],
            shift: [null, Validators.required],
        });
        this.shiftsArray.push(group);
        this.shiftsArray.updateValueAndValidity();
    }

    removeShift(index: number): void {
        this.shiftsArray.removeAt(index);
        this.shiftsArray.updateValueAndValidity();
    }

    trackByIndex = (_index: number) => _index;

    onSubmit(): void {
        if (this.eventForm.invalid) {
            this.eventForm.markAllAsTouched();
            return;
        }
        const raw = this.eventForm.getRawValue();

        const shifts = (raw.shifts || [])
            .map((s: any) => s?.shift)
            .filter((v: any) => v !== null && v !== undefined) as ShiftEnum[];

        if (this.isEditMode && this.eventId !== null) {
            const command = new UpdateEventCommand({
                name: raw.name ?? '',
                type: raw.eventType!,
                description: raw.description ?? '',
                eventDate: raw.eventDate!,
                startDate: raw.startDate!,
                endDate: raw.endDate!,
                slots: raw.slots!,
                shifts: shifts,
            });
            this.eventsService.update(this.eventId, command).subscribe({
                next: _ => { 
                    this.toastr.success('Evento atualizado com sucesso');
                    this.router.navigate(['/admin/events']); 
                },
                error: err => console.error('Erro ao atualizar evento:', err),
            });
        } else {
            const command = new CreateEventCommand({
                name: raw.name ?? '',
                type: raw.eventType!,
                description: raw.description ?? '',
                eventDate: raw.eventDate!,
                startDate: raw.startDate!,
                endDate: raw.endDate!,
                slots: raw.slots!,
                shifts: shifts,
            });
            this.eventsService.create(command).subscribe({
                next: _ => {
                    this.toastr.success('Evento criado com sucesso');
                    this.router.navigate(['/admin/events']);
                },
                error: err => console.error('Erro ao criar evento:', err),
            });
        }
    }

    onCancel(): void {
        window.history.back();
    }

    private uniqueShiftsValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!(control instanceof FormArray)) return null;

            control.controls.forEach(c => {
                const sc = c.get('shift');
                if (!sc) return;
                const errors = sc.errors || {};
                if ('duplicate' in errors) {
                    delete errors['duplicate'];
                    sc.setErrors(Object.keys(errors).length ? errors : null);
                }
            });

            const values = control.controls
                .map(c => c.get('shift')?.value)
                .filter(v => v !== null && v !== undefined);

            const seen = new Map<number, number[]>();
            values.forEach((v, idx) => {
                const arr = seen.get(v) ?? [];
                arr.push(idx);
                seen.set(v, arr);
            });

            let hasDuplicate = false;
            seen.forEach(indexes => {
                if (indexes.length > 1) {
                    hasDuplicate = true;
                    indexes.forEach(i => {
                        const sc = control.at(i).get('shift');
                        if (!sc) return;
                        const errors = sc.errors || {};
                        errors['duplicate'] = true;
                        sc.setErrors(errors);
                    });
                }
            });

            return hasDuplicate ? { duplicateShifts: true } : null;
        };
    }

    private requiredShiftValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!(control instanceof FormArray)) return null;

            const hasAtLeastOne = control.length > 0;
            if (!hasAtLeastOne) {
                return { required: true };
            }

            const hasValidShift = control.controls.some(c => !!c.get('shift')?.value);
            return hasValidShift ? null : { required: true };
        };
    }

    private dateConsistencyValidator(): ValidatorFn {
        return (form: AbstractControl): ValidationErrors | null => {
            const startC = form.get('startDate');
            const endC = form.get('endDate');
            const eventC = form.get('eventDate');

            const norm = (d: Date | null) => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
            const s = norm(startC?.value || null);
            const e = norm(endC?.value || null);
            const ev = norm(eventC?.value || null);

            const groupErrors: any = {};

            if (s && e && e < s) groupErrors.registrationRangeInvalid = true;

            const evErrors = eventC?.errors || {};
            // Event date must be strictly after registration end date
            if (ev && e && ev <= e) {
                eventC?.setErrors({ ...evErrors, eventBeforeRegistrationEnd: true });
            } else {
                if ('eventBeforeRegistrationEnd' in evErrors) {
                    delete evErrors['eventBeforeRegistrationEnd'];
                    eventC?.setErrors(Object.keys(evErrors).length ? evErrors : null);
                }
            }

            return Object.keys(groupErrors).length ? groupErrors : null;
        };
    }
}
