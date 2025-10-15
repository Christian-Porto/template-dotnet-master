import { Pipe, PipeTransform } from '@angular/core';
import { StatusEnum } from '../../../../../../api-client';

/**
 * Finds an object from given source using the given key - value pairs
 */
@Pipe({
    name: 'StatusEnum',
    pure: false,
    standalone: true,
})
export class StatusEnumPipe implements PipeTransform {
    transform(value: StatusEnum): any {
        if (value === StatusEnum.OpenForRegistration) {
            return 'Inscrições abertas';
        }
        if (value === StatusEnum.InProgress) {
            return 'Em andamento';
        }
        if (value === StatusEnum.RegistrationClosed) {
            return 'Inscrições encerradas';
        }
        if (value === StatusEnum.Completed) {
            return 'Finalizado';
        }
    }
}
