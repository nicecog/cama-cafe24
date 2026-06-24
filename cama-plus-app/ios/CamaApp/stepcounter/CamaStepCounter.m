#import "CamaStepCounter.h"

#import <CoreMotion/CoreMotion.h>
#import <HealthKit/HealthKit.h>

@interface CamaStepCounter ()
@property (nonatomic, strong) HKHealthStore *healthStore;
@end

@implementation CamaStepCounter

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (HKHealthStore *)healthStore
{
  if (_healthStore == nil) {
    _healthStore = [[HKHealthStore alloc] init];
  }
  return _healthStore;
}

- (NSDate *)startOfToday
{
  NSCalendar *calendar = [NSCalendar currentCalendar];
  NSDate *now = [NSDate date];
  NSDateComponents *components =
      [calendar components:(NSCalendarUnitYear | NSCalendarUnitMonth |
                            NSCalendarUnitDay)
                  fromDate:now];
  return [calendar dateFromComponents:components];
}

RCT_EXPORT_METHOD(requestHealthKitAuthorization
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)
{
  if (![HKHealthStore isHealthDataAvailable]) {
    reject(@"NO_STEP_SENSOR", @"HealthKit not available on this device", nil);
    return;
  }

  HKQuantityType *stepType =
      [HKQuantityType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount];
  NSSet *readTypes = [NSSet setWithObject:stepType];

  [self.healthStore
      requestAuthorizationToShareTypes:nil
                           readTypes:readTypes
                          completion:^(BOOL success, NSError *_Nullable error) {
                            if (error != nil) {
                              reject(@"HEALTHKIT_AUTH_ERROR", error.localizedDescription,
                                     error);
                              return;
                            }

                            HKAuthorizationStatus status =
                                [self.healthStore authorizationStatusForType:stepType];
                            if (status == HKAuthorizationStatusSharingDenied) {
                              reject(@"ACTIVITY_RECOGNITION_DENIED",
                                     @"HealthKit step count access denied", nil);
                              return;
                            }

                            resolve(@(success));
                          }];
}

RCT_EXPORT_METHOD(getTodayStepCount
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)
{
  if ([HKHealthStore isHealthDataAvailable]) {
    [self getTodayStepCountFromHealthKit:resolve rejecter:reject];
    return;
  }

  [self getTodayStepCountFromPedometer:resolve rejecter:reject];
}

- (void)getTodayStepCountFromHealthKit:(RCTPromiseResolveBlock)resolve
                              rejecter:(RCTPromiseRejectBlock)reject
{
  HKQuantityType *stepType =
      [HKQuantityType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount];
  NSSet *readTypes = [NSSet setWithObject:stepType];
  NSDate *startOfDay = [self startOfToday];
  NSDate *now = [NSDate date];

  void (^querySteps)(void) = ^{
    NSPredicate *predicate = [HKQuery
        predicateForSamplesWithStartDate:startOfDay
                                 endDate:now
                                   options:HKQueryOptionStrictStartDate];

    HKStatisticsQuery *query = [[HKStatisticsQuery alloc]
           initWithQuantityType:stepType
          quantitySamplePredicate:predicate
                          options:HKStatisticsOptionCumulativeSum
                completionHandler:^(
                    HKStatisticsQuery *statsQuery, HKStatistics *result,
                    NSError *error) {
                  if (error != nil) {
                    [self getTodayStepCountFromPedometer:resolve rejecter:reject];
                    return;
                  }

                  HKQuantity *sum = [result sumQuantity];
                  if (sum == nil) {
                    [self getTodayStepCountFromPedometer:resolve rejecter:reject];
                    return;
                  }

                  int steps =
                      (int)[sum doubleValueForUnit:[HKUnit countUnit]];
                  if (steps < 0) {
                    reject(@"STEP_COUNTER_INVALID", @"Invalid step count", nil);
                    return;
                  }

                  resolve(@(steps));
                }];

    [self.healthStore executeQuery:query];
  };

  HKAuthorizationStatus status =
      [self.healthStore authorizationStatusForType:stepType];
  if (status == HKAuthorizationStatusSharingDenied) {
    reject(@"ACTIVITY_RECOGNITION_DENIED", @"HealthKit step count access denied",
           nil);
    return;
  }

  if (status == HKAuthorizationStatusNotDetermined) {
    [self.healthStore
        requestAuthorizationToShareTypes:nil
                             readTypes:readTypes
                            completion:^(BOOL success, NSError *_Nullable error) {
                              if (error != nil) {
                                reject(@"HEALTHKIT_AUTH_ERROR",
                                       error.localizedDescription, error);
                                return;
                              }

                              HKAuthorizationStatus newStatus =
                                  [self.healthStore authorizationStatusForType:stepType];
                              if (newStatus == HKAuthorizationStatusSharingDenied) {
                                reject(@"ACTIVITY_RECOGNITION_DENIED",
                                       @"HealthKit step count access denied", nil);
                                return;
                              }

                              querySteps();
                            }];
    return;
  }

  querySteps();
}

- (void)getTodayStepCountFromPedometer:(RCTPromiseResolveBlock)resolve
                              rejecter:(RCTPromiseRejectBlock)reject
{
  if (![CMPedometer isStepCountingAvailable]) {
    reject(@"NO_STEP_SENSOR", @"Step counting not supported on this device", nil);
    return;
  }

  if (@available(iOS 11.0, *)) {
    CMAuthorizationStatus status = [CMPedometer authorizationStatus];
    if (status == CMAuthorizationStatusDenied ||
        status == CMAuthorizationStatusRestricted) {
      reject(@"ACTIVITY_RECOGNITION_DENIED", @"Motion permission denied", nil);
      return;
    }
  }

  NSDate *startOfDay = [self startOfToday];
  NSDate *now = [NSDate date];

  CMPedometer *pedometer = [[CMPedometer alloc] init];
  [pedometer
      queryPedometerDataFromDate:startOfDay
                          toDate:now
                     withHandler:^(CMPedometerData *_Nullable data,
                                   NSError *_Nullable error) {
                       if (error != nil) {
                         NSString *code = @"STEP_READ_ERROR";
                         if ([error.domain isEqualToString:CMErrorDomain]) {
                           if (error.code == CMErrorMotionActivityNotAuthorized) {
                             code = @"ACTIVITY_RECOGNITION_DENIED";
                           } else if (error.code == CMErrorNotAvailable) {
                             code = @"NO_STEP_SENSOR";
                           }
                         }
                         reject(code, error.localizedDescription, error);
                         return;
                       }

                       int steps = [data.numberOfSteps intValue];
                       if (steps < 0) {
                         reject(@"STEP_COUNTER_INVALID", @"Invalid step count", nil);
                         return;
                       }

                       resolve(@(steps));
                     }];
}

@end
