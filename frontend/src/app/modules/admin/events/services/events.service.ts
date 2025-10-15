import { Injectable } from '@angular/core';
import { EventResponse, EventTypeEnum, Status } from '../models/event.model';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor() { }

    public get events(): Observable<EventResponse[]> {
        return of([
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 1,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Dynamic,
            },
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 2,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Lecture,
            },
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 3,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Practice,
            },
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 4,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Dynamic,
            },
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 5,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Lecture,
            },
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 6,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Practice,
            },
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 7,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Lecture,
            },
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 8,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Lecture,
            },
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 9,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Lecture,
            },
            {
                description: 'An in-depth look at Angular and its core features.',
                endDate: new Date('2023-12-01T17:00:00'),
                eventDate: new Date('2023-12-01T09:00:00'),
                id: 10,
                name: 'Angular Fundamentals',
                shifts: [1, 2],
                slots: 50,
                startDate: new Date('2023-12-01T09:00:00'),
                status: Status.Active,
                type: EventTypeEnum.Lecture,
            },
        ]);
    }

    public get types(): Observable<EventTypeEnum[]> {
        return of([
            EventTypeEnum.Lecture,
            EventTypeEnum.Dynamic,
            EventTypeEnum.Practice,
        ]);
    }

    public get status(): Observable<Status[]> {
        return of([
            Status.Active,
            Status.Inactive,
        ]);
    }
}
