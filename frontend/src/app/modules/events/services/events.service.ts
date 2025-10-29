import { inject, Injectable } from '@angular/core';
import { EventResponse, EventTypeEnum, RegistrationStatusEnum, Status } from '../models/event.model';
import { Observable, of, map, switchMap } from 'rxjs';
import { EventsClient, StatusEnum as ApiStatusEnum, EventTypeEnum as ApiEventTypeEnum, IRegistrationsClient, RegistrationsClient, CreateRegistrationCommand, RegistrationResponse, RegistrationStatusEnum as ApiRegistrationStatusEnum } from '../../../../../api-client';

@Injectable({ providedIn: 'root' })
export class EventsService {
    private _eventsClient = inject(EventsClient);
    private _registrationsClient: IRegistrationsClient = inject(RegistrationsClient);

    public listEvents(
        pageIndex: number,
        pageSize: number,
        filter?: {
            type?: EventTypeEnum | 'all';
            status?: Status | 'all';
            query?: string;
            startDate?: Date;
            endDate?: Date;
            registrationStatus?: RegistrationStatusEnum | 'all';
            attended?: boolean;
        }
    ): Observable<EventResponse[]> {
        const mapUiStatusToApi = (status?: Status | 'all'): ApiStatusEnum | undefined => {
            if (status === undefined || status === 'all') return undefined;
            switch (status) {
                case Status.a:
                    return ApiStatusEnum.RegistrationNotStarted;
                case Status.b:
                    return ApiStatusEnum.OpenForRegistration;
                case Status.c:
                    return ApiStatusEnum.RegistrationClosed;
                default:
                    return undefined;
            }
        };

        const typeParam = (filter?.type && filter.type !== 'all')
            ? (filter.type as unknown as ApiEventTypeEnum)
            : undefined;
        const statusParam = mapUiStatusToApi(filter?.status);
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
            (filter?.registrationStatus !== undefined && filter.registrationStatus !== null && filter.registrationStatus !== 'all')
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

                    return items.map((e) => ({
                        id: e.id as number,
                        name: e.name ?? '',
                        type: (e.type as unknown) as EventTypeEnum,
                        description: e.description ?? '',
                        eventDate: e.eventDate as Date,
                        startDate: e.startDate as Date,
                        endDate: e.endDate as Date,
                        slots: (e.slots ?? 0) as number,
                        status: mapStatus(e.registrationStatus),
                        shifts: (e.shifts as unknown) as number[],
                    }));
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
                        status: mapStatus(e.registrationStatus),
                        shifts: (e.shifts as unknown) as number[],
                    } as EventResponse;
                })
            );
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
        ]);
    }

    public registerToEvent(eventId: number): Observable<RegistrationResponse> {
        const command = new CreateRegistrationCommand({ eventId });
        return this._registrationsClient.create(command);
    }

    public cancelRegistration(eventId: number): Observable<void> {
        return this._registrationsClient
            .cancel(eventId)
            .pipe(map(() => void 0));
    }

    public isRegistered(eventId: number): Observable<boolean> {
        return this._eventsClient
            .list(
                undefined as any,
                undefined as any,
                undefined as any,
                undefined as any,
                ApiRegistrationStatusEnum.Registered,
                undefined as any,
                1000,
                0
            )
            .pipe(map(p => (p?.items ?? []).some(e => (e.id as number) === eventId)));
    }

    public getMyRegistrationStatus(eventId: number): Observable<RegistrationStatusEnum | null> {
        // Check Selected → NotSelected → Registered
        const containsEvent = (status: ApiRegistrationStatusEnum) =>
            this._eventsClient
                .list(
                    undefined as any,
                    undefined as any,
                    undefined as any,
                    undefined as any,
                    status,
                    undefined as any,
                    1000,
                    0
                )
                .pipe(map(p => (p?.items ?? []).some(e => (e.id as number) === eventId)));

        return containsEvent(ApiRegistrationStatusEnum.Selected).pipe(
            switchMap(isSel => {
                if (isSel) return of(RegistrationStatusEnum.Selected);
                return containsEvent(ApiRegistrationStatusEnum.NotSelected).pipe(
                    switchMap(isNotSel => {
                        if (isNotSel) return of(RegistrationStatusEnum.NotSelected);
                        return containsEvent(ApiRegistrationStatusEnum.Registered).pipe(
                            map(isReg => (isReg ? RegistrationStatusEnum.Registered : null))
                        );
                    })
                );
            })
        );
    }
}
