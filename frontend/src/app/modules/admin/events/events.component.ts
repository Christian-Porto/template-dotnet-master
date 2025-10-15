import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass, PercentPipe, I18nPluralPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key';
import { BehaviorSubject, Subject, takeUntil, combineLatest } from 'rxjs';
import { EventsService } from './services/events.service';
import { EventResponse, EventTypeEnum, Status } from './models/event.model';
import { EventTypeEnumPipe } from './pipes/EventTypeEnum.pipe';
import { StatusPipe } from './pipes/Status.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
    selector: 'app-events',
    imports: [
        CdkScrollable,
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
        MatDatepickerModule
    ],
    templateUrl: './events.component.html',
    styleUrl: './events.component.scss'
})
export class EventsComponent {
    EventTypeEnum = EventTypeEnum;

    types: EventTypeEnum[];
    statuses: Status[];

    events: EventResponse[];
    filteredevents: EventResponse[];
    filters: {
        typeSlug$: BehaviorSubject<EventTypeEnum | 'all'>;
        status$: BehaviorSubject<Status | 'all'>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
            typeSlug$: new BehaviorSubject('all'),
            status$: new BehaviorSubject('all'),
            query$: new BehaviorSubject(''),
            hideCompleted$: new BehaviorSubject(false),
        };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _eventsService: EventsService
    ) { }

    ngOnInit(): void {
        this._eventsService.types
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((types: EventTypeEnum[]) => {
                this.types = types;

                this._changeDetectorRef.markForCheck();
            });

        this._eventsService.status
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((statuses: Status[]) => {
                this.statuses = statuses;

                this._changeDetectorRef.markForCheck();
            });

        this._eventsService.events
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((events: EventResponse[]) => {
                this.events = this.filteredevents = events;
                this._changeDetectorRef.markForCheck();
            });

        combineLatest([
            this.filters.typeSlug$,
            this.filters.query$,
            this.filters.hideCompleted$,
            this.filters.status$,
        ]).subscribe(([typeSlug, query, hideCompleted, status]) => {
            this.filteredevents = this.events;

            if (typeSlug !== 'all') {
                this.filteredevents = this.filteredevents.filter(
                    (eventresponse) => eventresponse.type === typeSlug
                );
            }

            if (status !== 'all') {
                this.filteredevents = this.filteredevents.filter(
                    (eventresponse) => eventresponse.status === status
                );
            }
            // Filter by search query
            if (query !== '') {
                this.filteredevents = this.filteredevents.filter(
                    (eventresponse) =>
                        eventresponse.name
                            .toLowerCase()
                            .includes(query.toLowerCase()) ||
                        eventresponse.description
                            .toLowerCase()
                            .includes(query.toLowerCase()) ||
                        eventresponse.type.toString()
                            .toLowerCase()
                            .includes(query.toLowerCase())
                );
            }
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    filterByQuery(query: string): void {
        this.filters.query$.next(query);
    }

    filterByType(change: MatSelectChange): void {
        this.filters.typeSlug$.next(change.value);
    }

    filterByStatus(change: MatSelectChange): void {
        this.filters.status$.next(change.value);
    }


    toggleCompleted(change: MatSlideToggleChange): void {
        this.filters.hideCompleted$.next(change.checked);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
