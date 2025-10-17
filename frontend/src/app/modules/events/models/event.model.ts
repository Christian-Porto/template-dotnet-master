import { Pipe, PipeTransform } from "@angular/core";

export interface EventResponse {
    id: number;
    name: string;
    type: EventTypeEnum;
    description: string;
    eventDate: Date;
    startDate: Date;
    endDate: Date;
    slots: number;
    status: Status;
    shifts: ShiftEnum[];
}

export enum ShiftEnum {
    Morning = 1,   // Matutino
    Afternoon = 2, // Vespertino
    Evening = 3    // Noturno
}

const SHIFT_LABELS: Record<ShiftEnum, string> = {
  [ShiftEnum.Morning]: 'Matutino',
  [ShiftEnum.Afternoon]: 'Vespertino',
  [ShiftEnum.Evening]: 'Noturno',
};

@Pipe({ name: 'formatShifts', standalone: true })
export class FormatShiftsPipe implements PipeTransform {
    transform(value?: ShiftEnum[] | null): string {
        if (!value || value.length === 0) return '';

        // Mapeia e remove duplicados mantendo a ordem
        const labels = value
            .filter(v => v != null)
            .map(v => SHIFT_LABELS[v as ShiftEnum] ?? String(v))
            .filter((v, i, a) => a.indexOf(v) === i);

        if (labels.length === 1) return labels[0];
        if (labels.length === 2) return `${labels[0]} e ${labels[1]}`;

        const last = labels[labels.length - 1];
        return `${labels.slice(0, -1).join(', ')} e ${last}`;
    }
}

export enum Status {
    a = 0,
    b = 1,
    c = 2,
    d = 3,
}

export enum EventTypeEnum {
    Lecture = 1,  // Palestra
    Dynamic = 2,  // Dinâmica
    Practice = 3  // Prática
}

export enum RegistrationStatusEnum {
    Registered = 0,
    NotSelected = 1,
    Selected = 2,
}
