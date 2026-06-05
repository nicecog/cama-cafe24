import mainApiClient from '@/services/apis/mainApiClient';

import { NotificationInfo } from '@/services/apis/notification/response';

/** 최근 알림 APIs **/
const notificationApi = {
  fetchRecentNotificationList() {
    /** 최근 알림 리스트 **/
    return mainApiClient.get<NotificationInfo[]>(`/api/notification/recent`);
  },
};

export default notificationApi;
