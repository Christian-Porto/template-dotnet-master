import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../models/event.model';

/**
 * Finds an object from given source using the given key - value pairs
 */
@Pipe({
    name: 'Status',
    pure: false,
    standalone: true,
})
export class StatusPipe implements PipeTransform {
    transform(value: Status): any {
        if (value === Status.Active) {
            return 'Ativo';
        }
        if (value === Status.Inactive) {
            return 'Inativo';
        }
    }
}
