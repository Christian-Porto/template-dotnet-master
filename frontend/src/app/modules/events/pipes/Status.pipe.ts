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
        if (value === Status.a) {
            return 'Inscrições abertas';
        }
        if (value === Status.b) {
            return 'Em andamento';
        }
        if (value === Status.c) {
            return 'Inscrições encerradas';
        }
        if (value === Status.d) {
            return 'Finalizado';
        }
    }
}
