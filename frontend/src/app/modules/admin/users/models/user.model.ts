import { ProfileEnum } from '../../../../../../api-client';

export interface UserResponse {
    id: number;
    name: string;
    enrollment: string;
    email?: string;
    profile: ProfileEnum;
    status: UserStatusEnum;
}

export interface PaginatedListOfUserResponse {
    totalCount: number;
    totalPages: number;
    pageIndex: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: UserResponse[];
}

export enum UserStatusEnum {
    Active = 1,
    Inactive = 2,
}
