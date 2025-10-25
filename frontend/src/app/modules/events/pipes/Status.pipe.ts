import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../models/event.model';

@Pipe({
    name: 'Status',
    pure: false,
    standalone: true,
})
export class StatusPipe implements PipeTransform {
    transform(value: Status): any {
        if (value === Status.a) {
            return 'Inscrições não iniciadas';
        }
        if (value === Status.b) {
            return 'Inscrições abertas';
        }
        if (value === Status.c) {
            return 'Inscrições encerradas';
        }
        return '';
    }
}

