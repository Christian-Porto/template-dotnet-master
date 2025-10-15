import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EventTypeEnum, StatusEnum } from '../../../../../../api-client';
import { EventTypeEnumPipe } from '../pipes/EventTypeEnum.pipe';
import { StatusEnumPipe } from '../pipes/Status.pipe';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-event-edit',
    imports: [
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        EventTypeEnumPipe,
        StatusEnumPipe,
        RouterLink
    ],
    templateUrl: './event-edit.component.html',
    styleUrl: './event-edit.component.scss'
})
export class EventEditComponent {

    EventTypeEnum = EventTypeEnum;
    StatusEnum = StatusEnum;

    shifts: { id: number; time: string }[] = [];
    private shiftCounter = 0;

    addShift(): void {
        this.shiftCounter++;
        this.shifts.push({
            id: this.shiftCounter,
            time: ''
        });
    }

    removeShift(index: number): void {
        this.shifts.splice(index, 1);
    }
}
