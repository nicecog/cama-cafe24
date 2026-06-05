package com.cama.batch.service.notification;


import com.cama.batch.dto.batch.BatchRsp;

public interface NotificationService {

    void scheduleNotification(BatchRsp dto);

    void scheduleMedicineNotification(BatchRsp dto);

    void scheduleHospitalNotification(BatchRsp dto);
    
    void scheduleHospitalNotification2(BatchRsp dto);
    
    void scheduleCancerInfoNotification(BatchRsp dto);
    
    void scheduleCancerInfo5Notification(BatchRsp dto);
    
    void scheduleCancerInfo6Notification(BatchRsp dto);
    
    void scheduleMentalityNotification(BatchRsp dto);
    
    void scheduleCancerInfo11Notification(BatchRsp dto);
    void scheduleCancerInfo12Notification(BatchRsp dto);
    void scheduleCancerInfo13Notification(BatchRsp dto);
    void scheduleCancerInfo14Notification(BatchRsp dto);

    void pushTest(String token);

}
