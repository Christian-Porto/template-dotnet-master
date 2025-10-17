import { inject, Injectable } from '@angular/core';
import { EventResponse, EventTypeEnum, RegistrationStatusEnum, Status } from '../models/event.model';
import { Observable, of, map } from 'rxjs';
import { EventsClient, StatusEnum as ApiStatusEnum, EventTypeEnum as ApiEventTypeEnum } from '../../../../../api-client';

@Injectable({ providedIn: 'root' })
export class EventsService {
    private _eventsClient = inject(EventsClient);

    public listEvents(
        pageIndex: number,
        pageSize: number,
        filter?: {
            type?: EventTypeEnum | 'all';
            status?: Status | 'all';
            query?: string;
            startDate?: Date;
            endDate?: Date;
            onlyMine?: boolean;
            attended?: boolean;
        }
    ): Observable<EventResponse[]> {
        const mapUiStatusToApi = (status?: Status | 'all'): ApiStatusEnum | undefined => {
            if (status === undefined || status === 'all') return undefined;
            switch (status) {
                case Status.a:
                    return ApiStatusEnum.OpenForRegistration;
                case Status.b:
                    return ApiStatusEnum.InProgress;
                case Status.c:
                    return ApiStatusEnum.RegistrationClosed;
                case Status.d:
                    return ApiStatusEnum.Completed;
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
        const onlyMineParam = filter?.onlyMine;
        const attendedParam = filter?.attended;

        return this._eventsClient
            .list(
                typeParam,
                statusParam,
                nameParam,
                startDateParam,
                endDateParam,
                onlyMineParam ?? undefined,
                attendedParam ?? undefined,
                pageSize,
                pageIndex
            )
            .pipe(
                map((paginated) => {
                    const items = paginated?.items ?? [];

                    const mapStatus = (status?: ApiStatusEnum): Status => {
                        switch (status) {
                            case ApiStatusEnum.OpenForRegistration:
                                return Status.a;
                            case ApiStatusEnum.InProgress:
                                return Status.b;
                            case ApiStatusEnum.RegistrationClosed:
                                return Status.c;
                            case ApiStatusEnum.Completed:
                                return Status.d;
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
                        status: mapStatus(e.status),
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
                            case ApiStatusEnum.OpenForRegistration:
                                return Status.a;
                            case ApiStatusEnum.InProgress:
                                return Status.b;
                            case ApiStatusEnum.RegistrationClosed:
                                return Status.c;
                            case ApiStatusEnum.Completed:
                                return Status.d;
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
