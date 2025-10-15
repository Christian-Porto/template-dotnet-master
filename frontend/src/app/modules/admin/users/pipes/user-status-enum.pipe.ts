import { Pipe, PipeTransform } from '@angular/core';
import { UserStatusEnum } from '../models/user.model';

@Pipe({
    name: 'UserStatusEnum',
    standalone: true,
})
export class UserStatusEnumPipe implements PipeTransform {
    transform(value: UserStatusEnum): string {
        switch (value) {
            case UserStatusEnum.Active:
                return 'Ativo';
            case UserStatusEnum.Inactive:
                return 'Inativo';
            default:
                return '-';
        }
    }
}
