import { Component, Input } from '@angular/core';
import { EventResponse, Status, FormatShiftsPipe } from '../../models/event.model';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventTypeEnumPipe } from '../../pipes/EventTypeEnum.pipe';
import { StatusPipe } from '../../pipes/Status.pipe';
import { NgClass, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-event-card',
    imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    NgClass,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterLink,
    EventTypeEnumPipe,
    StatusPipe,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormatShiftsPipe
],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
    @Input() event: EventResponse;


    Status = Status;
}
