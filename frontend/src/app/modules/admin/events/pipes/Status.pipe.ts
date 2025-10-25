import { Pipe, PipeTransform } from '@angular/core';
import { StatusEnum } from '../../../../../../api-client';

@Pipe({
    name: 'StatusEnum',
    pure: false,
    standalone: true,
})
export class StatusEnumPipe implements PipeTransform {
    transform(value: StatusEnum): any {
        if (value === StatusEnum.RegistrationNotStarted) {
            return 'Inscrições não iniciadas';
        }
        if (value === StatusEnum.OpenForRegistration) {
            return 'Inscrições abertas';
        }
        if (value === StatusEnum.RegistrationClosed) {
            return 'Inscrições encerradas';
        }
        return '';
    }
}

