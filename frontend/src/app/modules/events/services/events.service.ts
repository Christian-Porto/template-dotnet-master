import { Injectable } from '@angular/core';
import { EventResponse, EventTypeEnum, RegistrationStatusEnum, Status } from '../models/event.model';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor() { }

    public listEvents(pageIndex, pageSize): Observable<EventResponse[]> {
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
                status: Status.b,
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
                status: Status.a,
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
                status: Status.d,
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
                status: Status.c,
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
                status: Status.b,
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
                status: Status.a,
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
                status: Status.d,
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
                status: Status.c,
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
                status: Status.b,
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
                status: Status.a,
                type: EventTypeEnum.Lecture,
            },
        ]);
    }

    public getEventById(id: number): Observable<EventResponse> {
        let description = '';
        if (id !== 1) {
            description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu luctus enim, pharetra ultrices augue. Mauris elementum mi nec odio luctus, ut tristique leo egestas. Praesent vitae pharetra lectus, id gravida ante. Etiam at malesuada dolor, eget feugiat leo. Sed ut viverra nibh. Pellentesque non dui sit amet velit ultrices pellentesque sed ut magna. Mauris elementum sapien sit amet ex posuere ornare. Vivamus ut elit tincidunt, placerat mi quis, consequat magna. Nulla tristique commodo nunc. Vivamus blandit pharetra enim sed bibendum.
Nam interdum pharetra mi eu porta. Nulla eget facilisis ante. Ut aliquam tristique enim vitae condimentum. Integer ac turpis tellus. Mauris eu mi metus. Cras dapibus, ante porttitor tempus tristique, erat lorem tincidunt libero, in commodo nulla felis eget ipsum. Morbi nec eros eu orci fringilla lacinia eu quis dui.
Aenean et lacus tristique, condimentum augue vel, tincidunt nulla. Quisque egestas magna vitae nunc ornare, quis iaculis nisi semper. Pellentesque luctus turpis nunc, vitae laoreet metus commodo id. Ut volutpat, lacus et viverra condimentum, enim magna auctor mi, sit amet scelerisque neque lectus id nibh. Donec nisl nisl, rutrum sit amet sapien eget, feugiat tristique metus. Sed varius ipsum a maximus dignissim. Nullam sed tempor justo. Suspendisse et nisl orci.
Proin luctus viverra libero, eu scelerisque enim blandit fermentum. Morbi tempor faucibus ante in sagittis. Integer auctor rutrum ligula sit amet porttitor. Vestibulum lacus odio, dapibus vel eleifend et, cursus ut leo. Fusce lobortis sed risus sit amet volutpat. Sed urna lorem, condimentum sed mi auctor, condimentum viverra libero. Integer vitae neque imperdiet nunc facilisis consequat nec eget lectus. Fusce tortor risus, maximus id imperdiet quis, volutpat ut nisl. Aenean tincidunt faucibus nulla. Suspendisse mauris orci, feugiat et posuere ut, aliquam ac odio. Donec vehicula mi et dolor egestas, at blandit risus eleifend. Donec pharetra elementum magna, ac condimentum lorem interdum vel. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque faucibus finibus porta. Vestibulum dapibus sagittis sem, sit amet ullamcorper nisl vestibulum vel. Sed est mi, scelerisque nec aliquam vitae, facilisis quis orci.
Ut quis velit ut urna vehicula eleifend. Morbi felis orci, tristique auctor tristique sit amet, vulputate ut lectus. Aliquam sapien metus, auctor vel mauris eget, lobortis commodo ligula. Donec ut eros malesuada, gravida dui ut, posuere eros. Mauris ornare dictum augue ut suscipit. Suspendisse magna enim, pellentesque ut consequat mattis, feugiat ut augue. Curabitur lectus leo, elementum ut porta nec, faucibus in ipsum. Mauris congue viverra lacus, dignissim lacinia lacus mollis eget. Sed non ultricies lectus. Morbi lorem nisl, dapibus vitae dolor et, sollicitudin facilisis nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur nec ultricies felis, id aliquam orci. Etiam et accumsan neque, sit amet lacinia neque. Curabitur id pretium orci, ac convallis felis. Cras vitae massa nisi. Nullam eget nulla sit amet nisi varius mattis.
Donec porta sit amet neque non bibendum. Quisque risus tortor, sagittis convallis purus in, venenatis malesuada est. Vivamus mi lorem, luctus non libero id, fermentum ultrices sapien. Sed imperdiet mollis lectus, eget euismod magna tristique sed. Ut nec mi eget nunc lobortis porta. Donec mi lacus, finibus non tristique eu, mattis non libero. Sed sagittis erat enim, id egestas lorem ultricies quis. Sed laoreet sapien lectus, vitae sollicitudin lorem efficitur ut. Proin tincidunt ante et nulla suscipit pretium. Etiam semper varius elit. Proin at suscipit enim. Nam semper dolor vitae enim pharetra tempor. Cras tristique ante dolor, facilisis iaculis est tempor nec. Cras vel dui lacus.
Suspendisse id dui elit. Phasellus at tristique magna, et porta purus. Suspendisse luctus dolor lectus, nec vestibulum leo vulputate in. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu luctus enim, pharetra ultrices augue. Mauris elementum mi nec odio luctus, ut tristique leo egestas. Praesent vitae pharetra lectus, id gravida ante. Etiam at malesuada dolor, eget feugiat leo. Sed ut viverra nibh. Pellentesque non dui sit amet velit ultrices pellentesque sed ut magna. Mauris elementum sapien sit amet ex posuere ornare. Vivamus ut elit tincidunt, placerat mi quis, consequat magna. Nulla tristique commodo nunc. Vivamus blandit pharetra enim sed bibendum.
Nam interdum pharetra mi eu porta. Nulla eget facilisis ante. Ut aliquam tristique enim vitae condimentum. Integer ac turpis tellus. Mauris eu mi metus. Cras dapibus, ante porttitor tempus tristique, erat lorem tincidunt libero, in commodo nulla felis eget ipsum. Morbi nec eros eu orci fringilla lacinia eu quis dui.
Aenean et lacus tristique, condimentum augue vel, tincidunt nulla. Quisque egestas magna vitae nunc ornare, quis iaculis nisi semper. Pellentesque luctus turpis nunc, vitae laoreet metus commodo id. Ut volutpat, lacus et viverra condimentum, enim magna auctor mi, sit amet scelerisque neque lectus id nibh. Donec nisl nisl, rutrum sit amet sapien eget, feugiat tristique metus. Sed varius ipsum a maximus dignissim. Nullam sed tempor justo. Suspendisse et nisl orci.
Proin luctus viverra libero, eu scelerisque enim blandit fermentum. Morbi tempor faucibus ante in sagittis. Integer auctor rutrum ligula sit amet porttitor. Vestibulum lacus odio, dapibus vel eleifend et, cursus ut leo. Fusce lobortis sed risus sit amet volutpat. Sed urna lorem, condimentum sed mi auctor, condimentum viverra libero. Integer vitae neque imperdiet nunc facilisis consequat nec eget lectus. Fusce tortor risus, maximus id imperdiet quis, volutpat ut nisl. Aenean tincidunt faucibus nulla. Suspendisse mauris orci, feugiat et posuere ut, aliquam ac odio. Donec vehicula mi et dolor egestas, at blandit risus eleifend. Donec pharetra elementum magna, ac condimentum lorem interdum vel. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque faucibus finibus porta. Vestibulum dapibus sagittis sem, sit amet ullamcorper nisl vestibulum vel. Sed est mi, scelerisque nec aliquam vitae, facilisis quis orci.
Ut quis velit ut urna vehicula eleifend. Morbi felis orci, tristique auctor tristique sit amet, vulputate ut lectus. Aliquam sapien metus, auctor vel mauris eget, lobortis commodo ligula. Donec ut eros malesuada, gravida dui ut, posuere eros. Mauris ornare dictum augue ut suscipit. Suspendisse magna enim, pellentesque ut consequat mattis, feugiat ut augue. Curabitur lectus leo, elementum ut porta nec, faucibus in ipsum. Mauris congue viverra lacus, dignissim lacinia lacus mollis eget. Sed non ultricies lectus. Morbi lorem nisl, dapibus vitae dolor et, sollicitudin facilisis nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur nec ultricies felis, id aliquam orci. Etiam et accumsan neque, sit amet lacinia neque. Curabitur id pretium orci, ac convallis felis. Cras vitae massa nisi. Nullam eget nulla sit amet nisi varius mattis.
Donec porta sit amet neque non bibendum. Quisque risus tortor, sagittis convallis purus in, venenatis malesuada est. Vivamus mi lorem, luctus non libero id, fermentum ultrices sapien. Sed imperdiet mollis lectus, eget euismod magna tristique sed. Ut nec mi eget nunc lobortis porta. Donec mi lacus, finibus non tristique eu, mattis non libero. Sed sagittis erat enim, id egestas lorem ultricies quis. Sed laoreet sapien lectus, vitae sollicitudin lorem efficitur ut. Proin tincidunt ante et nulla suscipit pretium. Etiam semper varius elit. Proin at suscipit enim. Nam semper dolor vitae enim pharetra tempor. Cras tristique ante dolor, facilisis iaculis est tempor nec. Cras vel dui lacus.
Suspendisse id dui elit. Phasellus at tristique magna, et porta purus. Suspendisse luctus dolor lectus, nec vestibulum leo vulputate in. Nulla iaculis convallis orci nec tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vulputate sagittis malesuada. Ut eu vestibulum justo, id placerat urna. Morbi tincidunt dui in imperdiet vestibulum. Nulla convallis neque facilisis, fermentum mi id, finibus metus. Suspendisse vitae mattis neque. Duis ut dolor lectus. Vestibulum dictum orci et arcu euismod fermentum.Nulla iaculis convallis orci nec tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vulputate sagittis malesuada. Ut eu vestibulum justo, id placerat urna. Morbi tincidunt dui in imperdiet vestibulum. Nulla convallis neque facilisis, fermentum mi id, finibus metus. Suspendisse vitae mattis neque. Duis ut dolor lectus. Vestibulum dictum orci et arcu euismod fermentum.'`;
        } else {
            description = 'This event provides an in-depth exploration of Angular, covering its core features, best practices, and practical applications. Attendees will gain hands-on experience and insights from industry experts, making it ideal for both beginners and experienced developers looking to deepen their understanding of Angular. The workshop will include interactive sessions, real-world examples, and opportunities for networking with fellow participants. By the end of the event, attendees will be equipped with the knowledge and skills to build robust Angular applications and stay updated with the latest advancements in the framework.';
        }
        return of({
            description: description,
            endDate: new Date('2023-12-01T17:00:00'),
            eventDate: new Date('2023-12-01T09:00:00'),
            id: 1,
            name: 'Angular Fundamentals',
            shifts: [1, 2],
            slots: 50,
            startDate: new Date('2023-12-01T09:00:00'),
            status: Status.b,
            type: EventTypeEnum.Dynamic,
        });
    }

    public get types(): Observable<EventTypeEnum[]> {
        return of([
            EventTypeEnum.Lecture,
            EventTypeEnum.Dynamic,
            EventTypeEnum.Practice,
        ]);
    }

    public get registrationStatus(): Observable<RegistrationStatusEnum[]> {
        return of([
            RegistrationStatusEnum.Registered,
            RegistrationStatusEnum.NotSelected,
            RegistrationStatusEnum.Selected,
        ]);
    }

    public get status(): Observable<Status[]> {
        return of([
            Status.a,
            Status.b,
            Status.c,
            Status.d,
        ]);
    }
}
