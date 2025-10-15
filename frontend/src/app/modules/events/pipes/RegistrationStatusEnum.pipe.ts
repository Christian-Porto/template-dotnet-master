import { Pipe, PipeTransform } from '@angular/core';
import { RegistrationStatusEnum } from '../models/event.model';

/**
 * Finds an object from given source using the given key - value pairs
 */
@Pipe({
    name: 'RegistrationStatusEnum',
    pure: false,
    standalone: true,
})
export class RegistrationStatusEnumPipe implements PipeTransform {
    transform(value: RegistrationStatusEnum): any {
        if (value === RegistrationStatusEnum.Registered) {
            return 'Inscrito';
        }
        if (value === RegistrationStatusEnum.NotSelected) {
            return 'Não Selecionado';
        }
        if (value === RegistrationStatusEnum.Selected) {
            return 'Selecionado';
        }
    }
}
