import { Pipe, PipeTransform } from '@angular/core';
import { ProfileEnum } from '../../../../../../api-client';

@Pipe({
    name: 'ProfileEnum',
    standalone: true,
})
export class ProfileEnumPipe implements PipeTransform {
    transform(value: ProfileEnum): string {
        switch (value) {
            case ProfileEnum.Administrator:
                return 'Administrador';
            case ProfileEnum.Monitor:
                return 'Monitor';
            case ProfileEnum.Student:
                return 'Aluno';
            default:
                return '-';
        }
    }
}
