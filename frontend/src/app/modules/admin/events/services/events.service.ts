import { inject, Injectable } from '@angular/core';
import { EventResponse, EventTypeEnum, RegistrationStatusEnum, Status, PaginatedListOfEventResponse } from 'app/modules/events/models/event.model';
import { Observable, of, map } from 'rxjs';
import { EventsClient, StatusEnum as ApiStatusEnum, EventTypeEnum as ApiEventTypeEnum, CreateEventCommand, RegistrationsClient, PaginatedListOfRegistrationResponse, UpdateEventCommand, RegistrationStatusEnum as ApiRegistrationStatusEnum, UpdateRegistrationStatusCommand, RegistrationResponse, UpdateAttendanceCommand } from '../../../../../../api-client';

@Injectable({ providedIn: 'root' })
export class EventsService {
    private _eventsClient = inject(EventsClient);
    private _registrationsClient = inject(RegistrationsClient);

        public listEvents(
        pageIndex: number,
        pageSize: number,
        filter?: {
            type?: ApiEventTypeEnum | 'all';
            status?: ApiStatusEnum | 'all';
            query?: string;
            startDate?: Date;
            endDate?: Date;
            registrationStatus?: RegistrationStatusEnum | 'all';
            attended?: boolean;
        }
    ): Observable<PaginatedListOfEventResponse> {
        const typeParam = (filter?.type && filter.type !== 'all') ? filter.type : undefined;
        const statusParam = (filter?.status && filter.status !== 'all') ? filter.status : undefined;
        const nameParam = filter?.query && filter.query.trim() !== '' ? filter.query.trim() : undefined;
        const coerceToDate = (d: any): Date | undefined => {
            if (!d) return undefined;
            if (d instanceof Date) return d;
            if (typeof d === 'string' || typeof d === 'number') {
                const dt = new Date(d);
                return isNaN(dt.getTime()) ? undefined : dt;
            }
            // MatDateRangeInput may emit objects from custom adapters; try valueOf()
            try {
                const dt = new Date((d as any).value ?? (d as any));
                return isNaN(dt.getTime()) ? undefined : dt;
            } catch {
                return undefined;
            }
        };
        const startDateParam = coerceToDate(filter?.startDate);
        const endDateParam = coerceToDate(filter?.endDate);
        const eventDateParam: Date[] | undefined =
            (startDateParam || endDateParam)
                ? [startDateParam, endDateParam].filter((d): d is Date => !!d)
                : undefined;
        const registrationStatusParam: ApiRegistrationStatusEnum | undefined =
            (filter?.registrationStatus !== undefined && filter.registrationStatus !== 'all')
                ? (filter.registrationStatus as unknown as ApiRegistrationStatusEnum)
                : undefined;
        const attendedParam = filter?.attended;

        return this._eventsClient
            .list(
                typeParam,
                statusParam,
                nameParam,
                eventDateParam,
                registrationStatusParam,
                attendedParam ?? undefined,
                pageSize,
                pageIndex
            )
            .pipe(
                map((paginated) => {
                    const items = paginated?.items ?? [];

                    const mapStatus = (status?: ApiStatusEnum): Status => {
                        switch (status) {
                            case ApiStatusEnum.RegistrationNotStarted:
                                return Status.a;
                            case ApiStatusEnum.OpenForRegistration:
                                return Status.b;
                            case ApiStatusEnum.RegistrationClosed:
                                return Status.c;
                            default:
                                return Status.a;
                        }
                    };

                    const mappedItems: EventResponse[] = items.map((e) => ({
                        id: e.id as number,
                        name: e.name ?? '',
                        type: (e.type as unknown) as EventTypeEnum,
                        description: e.description ?? '',
                        eventDate: e.eventDate as Date,
                        startDate: e.startDate as Date,
                        endDate: e.endDate as Date,
                        slots: (e.slots ?? 0) as number,
                        status: mapStatus(e.status),
                        shifts: (e.shifts as unknown) as number[],
                    }));

                    return {
                        items: mappedItems,
                        pageIndex: paginated?.pageIndex ?? pageIndex,
                        totalPages: paginated?.totalPages ?? 0,
                        totalCount: paginated?.totalCount ?? mappedItems.length,
                        hasPreviousPage: paginated?.hasPreviousPage ?? false,
                        hasNextPage: paginated?.hasNextPage ?? false,
                    } as PaginatedListOfEventResponse;
                })
            );
    }

    public getEventById(id: number): Observable<EventResponse> {
        return this._eventsClient
            .get(id)
            .pipe(
                map((e) => {
                    const mapStatus = (status?: ApiStatusEnum): Status => {
                        switch (status) {
                            case ApiStatusEnum.RegistrationNotStarted:
                                return Status.a;
                            case ApiStatusEnum.OpenForRegistration:
                                return Status.b;
                            case ApiStatusEnum.RegistrationClosed:
                                return Status.c;
                            default:
                                return Status.a;
                        }
                    };

                    return {      
                        id: e.id as number,
                        name: e.name ?? "",
                        type: (e.type as unknown) as EventTypeEnum,
                        description: e.description ?? "",
                        eventDate: e.eventDate as Date,
                        startDate: e.startDate as Date,
                        endDate: e.endDate as Date,
                        slots: (e.slots ?? 0) as number,
                        status: mapStatus(e.status),
                        shifts: (e.shifts as unknown) as number[],
                    } as EventResponse;
                })
            );
    }

    public listRegistrations(
        eventId: number,
        pageIndex: number,
        pageSize: number
    ): Observable<PaginatedListOfRegistrationResponse> {
        return this._registrationsClient.list(eventId, pageSize, pageIndex);
    }

    public listAttendances(
        eventId: number,
        pageIndex: number,
        pageSize: number
    ): Observable<PaginatedListOfRegistrationResponse> {
        // List only selected registrations for attendance marking
        return this._registrationsClient.listSelected(eventId, pageSize, pageIndex);
    }

    public updateAttendance(
        registrationId: number,
        options: { attended?: boolean; justification?: string }
    ) {
        const command = new UpdateAttendanceCommand({
            attended: options.attended,
            justification: options.justification,
        });
        return this._registrationsClient.updateAttendance(registrationId, command);
    }

    public updateRegistrationStatus(
        registrationId: number,
        status: ApiRegistrationStatusEnum
    ): Observable<RegistrationResponse> {
        const command = new UpdateRegistrationStatusCommand({ status });
        return this._registrationsClient.updateStatus(registrationId, command);
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
            RegistrationStatusEnum.NotSelected,
            RegistrationStatusEnum.Selected,
        ]);
    }

    public get status(): Observable<Status[]> {
        return of([
            Status.a,
            Status.b,
            Status.c,
        ]);
    }

    public create(command: CreateEventCommand): Observable<EventResponse> {
        return this._eventsClient
            .create(command)
            .pipe(
                map((e) => {
                    const mapStatus = (status?: ApiStatusEnum): Status => {
                        switch (status) {
                            case ApiStatusEnum.RegistrationNotStarted:
                                return Status.a;
                            case ApiStatusEnum.OpenForRegistration:
                                return Status.b;
                            case ApiStatusEnum.RegistrationClosed:
                                return Status.c;
                            default:
                                return Status.a;
                        }
                    };

                    return {
                        id: e.id as number,
                        name: e.name ?? '',
                        type: (e.type as unknown) as EventTypeEnum,
                        description: e.description ?? '',
                        eventDate: e.eventDate as Date,
                        startDate: e.startDate as Date,
                        endDate: e.endDate as Date,
                        slots: (e.slots ?? 0) as number,
                        status: mapStatus(e.status),
                        shifts: (e.shifts as unknown) as number[],
                    } as EventResponse;
                })
            );
    }

    public update(id: number, command: UpdateEventCommand): Observable<EventResponse> {
        return this._eventsClient
            .update(id, command)
            .pipe(
                map((e) => {
                    const mapStatus = (status?: ApiStatusEnum): Status => {
                        switch (status) {
                            case ApiStatusEnum.RegistrationNotStarted:
                                return Status.a;
                            case ApiStatusEnum.OpenForRegistration:
                                return Status.b;
                            case ApiStatusEnum.RegistrationClosed:
                                return Status.c;
                            default:
                                return Status.a;
                        }
                    };

                    return {
                        id: e.id as number,
                        name: e.name ?? '',
                        type: (e.type as unknown) as EventTypeEnum,
                        description: e.description ?? '',
                        eventDate: e.eventDate as Date,
                        startDate: e.startDate as Date,
                        endDate: e.endDate as Date,
                        slots: (e.slots ?? 0) as number,
                        status: mapStatus(e.status),
                        shifts: (e.shifts as unknown) as number[],
                    } as EventResponse;
                })
            );
    }
    
}
