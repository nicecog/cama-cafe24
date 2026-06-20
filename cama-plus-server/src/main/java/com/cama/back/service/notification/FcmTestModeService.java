package com.cama.back.service.notification;

import com.cama.back.dto.monitor.AdminNotificationSendRequest;
import com.cama.back.dto.monitor.AdminNotificationSendResult;
import com.cama.back.dto.monitor.FcmTestModeStatusRsp;

public interface FcmTestModeService {

    FcmTestModeStatusRsp getStatus();

    FcmTestModeStatusRsp prepareTestMode();

    FcmTestModeStatusRsp restoreTestMode();

    AdminNotificationSendResult sendAdminNotification(AdminNotificationSendRequest request);
}
