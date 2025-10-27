import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, Type, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BehaviorSubject, Subject, takeUntil, combineLatest, switchMap, debounceTime, filter } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EventTypeEnum, Status, EventResponse, RegistrationStatusEnum } from '../models/event.model';
import { EventTypeEnumPipe } from '../pipes/EventTypeEnum.pipe';
import { StatusPipe } from '../pipes/Status.pipe';
import { EventsService } from '../services/events.service';
import { EventCardComponent } from './event-card/event-card.component';
import { RegistrationStatusEnumPipe } from '../pipes/RegistrationStatusEnum.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
    selector: 'app-event-list',
    imports: [
        CdkScrollable,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatButtonModule,
        EventTypeEnumPipe,
        StatusPipe,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        EventCardComponent,
        RegistrationStatusEnumPipe,
        MatProgressSpinnerModule
    ],
    templateUrl: './event-list.component.html',
    styleUrl: './event-list.component.scss',
})
export class EventListComponent implements AfterViewInit {
    @ViewChild(CdkScrollable) scrollable!: CdkScrollable;
    EventTypeEnum = EventTypeEnum;
    RegistrationStatusEnum = RegistrationStatusEnum;
    Status = Status;
    types: EventTypeEnum[];
    registrationStatuses: RegistrationStatusEnum[];
    statuses: Status[];
    events: EventResponse[] = [];
    filteredevents: EventResponse[] = [];
    
    pageIndex: number = 1;
    pageSize: number = 12;
    isLoading: boolean = false;
    hasMoreData: boolean = true;

    filters: {
        typeSlug$: BehaviorSubject<EventTypeEnum | 'all'>;
        status$: BehaviorSubject<Status | 'all'>;
        registrationStatus$: BehaviorSubject<RegistrationStatusEnum | 'all'>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
        startDate$: BehaviorSubject<Date | null>;
        endDate$: BehaviorSubject<Date | null>;
        attended$: BehaviorSubject<boolean | 'all'>;
    } = {
            typeSlug$: new BehaviorSubject('all'),
            status$: new BehaviorSubject('all'),
            registrationStatus$: new BehaviorSubject('all'),
            query$: new BehaviorSubject(''),
            hideCompleted$: new BehaviorSubject(false),
            startDate$: new BehaviorSubject<Date | null>(null),
            endDate$: new BehaviorSubject<Date | null>(null),
            attended$: new BehaviorSubject<'all' | boolean>('all'),
        };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _eventsService: EventsService
    ) { }

    ngOnInit(): void {
        this._eventsService.types
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((types: EventTypeEnum[]) => {
                this.types = types;

                this._changeDetectorRef.markForCheck();
            });

        this._eventsService.registrationStatus
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((registrationStatuses: RegistrationStatusEnum[]) => {
                this.registrationStatuses = registrationStatuses;
            });

        this._eventsService.status
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((statuses: Status[]) => {
                this.statuses = statuses;

                this._changeDetectorRef.markForCheck();
            });

        combineLatest([
            this.filters.typeSlug$,
            this.filters.status$,
            this.filters.query$,
            this.filters.startDate$,
            this.filters.endDate$,
            this.filters.attended$,
            this.filters.registrationStatus$, // ensure changes trigger refresh
        ])
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                // Reset pagination when filters change
                this.resetAndLoadEvents();
            });
    }

    ngAfterViewInit(): void {
        // Setup infinite scroll
        this.scrollable.elementScrolled()
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(200),
                filter(() => !this.isLoading && this.hasMoreData)
            )
            .subscribe(() => {
                this.checkScrollPosition();
            });
    }

    private checkScrollPosition(): void {
        const element = this.scrollable.getElementRef().nativeElement;
        const scrollPosition = element.scrollTop + element.clientHeight;
        const scrollHeight = element.scrollHeight;
        
        // Load more when user is within 300px of the bottom
        if (scrollHeight - scrollPosition < 300) {
            this.loadMoreEvents();
        }
    }

    private resetAndLoadEvents(): void {
        this.pageIndex = 1;
        this.events = [];
        this.filteredevents = [];
        this.hasMoreData = true;
        this.loadMoreEvents();
    }

    private loadMoreEvents(): void {
        if (this.isLoading || !this.hasMoreData) {
            return;
        }

        this.isLoading = true;
        const typeSlug = this.filters.typeSlug$.value;
        const status = this.filters.status$.value;
        const query = this.filters.query$.value;
        const startDate = this.filters.startDate$.value;
        const endDate = this.filters.endDate$.value;
        const attended = this.filters.attended$.value;
        const registrationStatus = this.filters.registrationStatus$.value;

        this._eventsService.listEvents(this.pageIndex, this.pageSize, {
            type: typeSlug,
            status: status,
            query: query,
            startDate: startDate ?? undefined,
            endDate: endDate ?? undefined,
            attended: attended === 'all' ? undefined : attended,
            registrationStatus: registrationStatus,
        }).subscribe({
            next: (events: EventResponse[]) => {
                if (events.length < this.pageSize) {
                    this.hasMoreData = false;
                }

                this.events = [...this.events, ...events];
                
                // Aplicar filtros apenas locais (não suportados pela API)
                this.filteredevents = this.events;
                if (this.filters.hideCompleted$.value) {
                    // With new statuses, treat 'RegistrationClosed' as completed
                    this.filteredevents = this.filteredevents.filter((e) => e.status !== Status.c);
                }
                
                this.pageIndex++;
                this.isLoading = false;
                this._changeDetectorRef.markForCheck();
            },
            error: () => {
                this.isLoading = false;
                this.hasMoreData = false;
                this._changeDetectorRef.markForCheck();
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

    filterByRegistrationStatus(change: MatSelectChange): void {
        this.filters.registrationStatus$.next(change.value);
    }

    filterByDate(date: Date | null): void {
        this.filters.startDate$.next(date);
    }

    filterByStartDate(date: Date | null): void {
        this.filters.startDate$.next(date);
    }

    filterByEndDate(date: Date | null): void {
        this.filters.endDate$.next(date);
    }

    filterByAttended(change: MatSelectChange): void {
        this.filters.attended$.next(change.value);
    }

    toggleCompleted(change: MatSlideToggleChange): void {
        this.filters.hideCompleted$.next(change.checked);
        // Reapply local filter
        this.filteredevents = this.events;
        if (change.checked) {
            this.filteredevents = this.filteredevents.filter((e) => e.status !== Status.d);
        }
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
