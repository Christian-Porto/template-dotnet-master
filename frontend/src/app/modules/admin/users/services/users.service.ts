import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaginatedListOfUserResponse, UserResponse, UserStatusEnum } from '../models/user.model';
import { ProfileEnum } from '../../../../../../api-client';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor() { }

    public listUsers(pageIndex: number, pageSize: number, filter: any): Observable<PaginatedListOfUserResponse> {
        // Mock data - substituir por chamada real à API
        return of(<PaginatedListOfUserResponse>{
            totalPages: 5,
            totalCount: 120,
            pageIndex: pageIndex,
            hasNextPage: true,
            hasPreviousPage: pageIndex > 0,
            items: [
                {
                    id: 1,
                    name: 'João Silva',
                    enrollment: '2023001',
                    email: 'joao.silva@example.com',
                    profile: ProfileEnum.Student,
                    status: UserStatusEnum.Active,
                },
                {
                    id: 2,
                    name: 'Maria Santos',
                    enrollment: '2023002',
                    email: 'maria.santos@example.com',
                    profile: ProfileEnum.Monitor,
                    status: UserStatusEnum.Active,
                },
                {
                    id: 3,
                    name: 'Pedro Oliveira',
                    enrollment: '2023003',
                    email: 'pedro.oliveira@example.com',
                    profile: ProfileEnum.Student,
                    status: UserStatusEnum.Active,
                },
                {
                    id: 4,
                    name: 'Ana Costa',
                    enrollment: '2023004',
                    email: 'ana.costa@example.com',
                    profile: ProfileEnum.Administrator,
                    status: UserStatusEnum.Active,
                },
                {
                    id: 5,
                    name: 'Carlos Ferreira',
                    enrollment: '2023005',
                    email: 'carlos.ferreira@example.com',
                    profile: ProfileEnum.Student,
                    status: UserStatusEnum.Inactive,
                },
                {
                    id: 6,
                    name: 'Beatriz Lima',
                    enrollment: '2023006',
                    email: 'beatriz.lima@example.com',
                    profile: ProfileEnum.Monitor,
                    status: UserStatusEnum.Active,
                },
                {
                    id: 7,
                    name: 'Ricardo Souza',
                    enrollment: '2023007',
                    email: 'ricardo.souza@example.com',
                    profile: ProfileEnum.Student,
                    status: UserStatusEnum.Active,
                },
                {
                    id: 8,
                    name: 'Juliana Alves',
                    enrollment: '2023008',
                    email: 'juliana.alves@example.com',
                    profile: ProfileEnum.Student,
                    status: UserStatusEnum.Active,
                },
                {
                    id: 9,
                    name: 'Fernando Rocha',
                    enrollment: '2023009',
                    email: 'fernando.rocha@example.com',
                    profile: ProfileEnum.Student,
                    status: UserStatusEnum.Inactive,
                },
                {
                    id: 10,
                    name: 'Camila Martins',
                    enrollment: '2023010',
                    email: 'camila.martins@example.com',
                    profile: ProfileEnum.Student,
                    status: UserStatusEnum.Active,
                },
            ]
        });
    }

    public getUserById(id: number): Observable<UserResponse> {
        // Mock data - substituir por chamada real à API
        return of(<UserResponse>{
            id: id,
            name: 'João Silva',
            enrollment: '2023001',
            email: 'joao.silva@example.com',
            profile: ProfileEnum.Student,
            status: UserStatusEnum.Active,
        });
    }
}
