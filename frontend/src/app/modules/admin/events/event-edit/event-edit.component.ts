import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { EventTypeEnum, StatusEnum } from '../../../../../../api-client';
import { EventTypeEnumPipe } from '../pipes/EventTypeEnum.pipe';
import { StatusEnumPipe } from '../pipes/Status.pipe';

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
    StatusEnumPipe,
    RouterLink,
  ],
  templateUrl: './event-edit.component.html',
  styleUrl: './event-edit.component.scss',
})
export class EventEditComponent implements OnInit {
  EventTypeEnum = EventTypeEnum;
  StatusEnum = StatusEnum;

  eventForm!: FormGroup;
  isEditMode = false;
  private shiftCounter = 0;

  constructor(private readonly route: ActivatedRoute, private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;

    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      eventType: [null, Validators.required],
      status: [null, Validators.required],
      eventDate: [null, Validators.required],
      registrationDate: [null, Validators.required],
      // pelo menos 1 turno
      shifts: this.fb.array([], [Validators.minLength(1)]),
    });

    // exemplo: adicionar um primeiro turno vazio (opcional)
    // this.addShift();
  }

  // getters
  get fc() {
    return this.eventForm.controls as {
      name: FormControl<string | null>;
      description: FormControl<string | null>;
      eventType: FormControl<EventTypeEnum | null>;
      status: FormControl<StatusEnum | null>;
      eventDate: FormControl<Date | null>;
      registrationDate: FormControl<Date | null>;
      shifts: FormArray;
    };
  }

  get shiftsArray(): FormArray {
    return this.fc.shifts as FormArray;
  }

  addShift(): void {
    this.shiftCounter++;
    const group = this.fb.group({
      id: [this.shiftCounter],
      time: ['', Validators.required],
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
    const payload = this.eventForm.getRawValue();
    console.log('Salvar Evento ->', payload);
    // TODO: chamar serviço de save
  }

  onCancel(): void {
    window.history.back();
  }
}
