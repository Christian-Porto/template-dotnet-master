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

export enum Status {
    Inactive = 0,
    Active = 1
}

export enum EventTypeEnum {
    Lecture = 1,  // Palestra
    Dynamic = 2,  // Dinâmica
    Practice = 3  // Prática
}
