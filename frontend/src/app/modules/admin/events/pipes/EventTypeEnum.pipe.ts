import { Pipe, PipeTransform } from '@angular/core';
import { EventTypeEnum } from '../models/event.model';

/**
 * Finds an object from given source using the given key - value pairs
 */
@Pipe({
    name: 'EventTypeEnum',
    pure: false,
    standalone: true,
})
export class EventTypeEnumPipe implements PipeTransform {
    transform(value: EventTypeEnum): any {
        if (value === EventTypeEnum.Lecture) {
            return 'Palestra';
        }
        if (value === EventTypeEnum.Dynamic) {
            return 'Dinâmica';
        }
        if (value === EventTypeEnum.Practice) {
            return 'Prática';
        }
    }
}
