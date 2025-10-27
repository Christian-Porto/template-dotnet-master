import { inject, Injectable } from '@angular/core';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { UserMockApi } from 'app/mock-api/common/user/api';
import { ActivitiesMockApi } from 'app/mock-api/pages/activities/api';
import { IconsMockApi } from 'app/mock-api/ui/icons/api';

@Injectable({ providedIn: 'root' })
export class MockApiService {
    activitiesMockApi = inject(ActivitiesMockApi);
    authMockApi = inject(AuthMockApi);
    iconsMockApi = inject(IconsMockApi);
    messagesMockApi = inject(MessagesMockApi);
    notificationsMockApi = inject(NotificationsMockApi);
    userMockApi = inject(UserMockApi);
}
