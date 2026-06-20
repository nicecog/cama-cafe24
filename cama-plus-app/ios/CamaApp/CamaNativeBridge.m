#import "CamaNativeBridge.h"

#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

static NSString *const kNotImplemented = @"NOT_IMPLEMENTED";

@implementation CamaNativeBridge

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_METHOD(getCapabilities : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  resolve([self buildCapabilities:NO]);
}

RCT_EXPORT_METHOD(capturePhoto : (NSDictionary *)options resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  reject(kNotImplemented, @"Native bridge stub — implementation pending", nil);
}

RCT_EXPORT_METHOD(pickPhotoFromLibrary : (NSDictionary *)options resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  reject(kNotImplemented, @"Native bridge stub — implementation pending", nil);
}

RCT_EXPORT_METHOD(getCurrentLocation : (NSDictionary *)options resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  reject(kNotImplemented, @"Native bridge stub — implementation pending", nil);
}

RCT_EXPORT_METHOD(readVital : (NSString *)vitalTypeCd resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  reject(kNotImplemented, @"Native bridge stub — implementation pending", nil);
}

RCT_EXPORT_METHOD(isBiometricAvailable : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  reject(kNotImplemented, @"Native bridge stub — implementation pending", nil);
}

RCT_EXPORT_METHOD(authenticateBiometric : (NSDictionary *)options resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  reject(kNotImplemented, @"Native bridge stub — implementation pending", nil);
}

- (NSDictionary *)buildCapabilities:(BOOL)implemented
{
  return @{
    @"platform" : @"ios",
    @"camera" : [self capability:YES implemented:implemented permissions:@[ @"NSCameraUsageDescription" ]],
    @"photoLibrary" : [self capability:YES implemented:implemented permissions:@[ @"NSPhotoLibraryUsageDescription" ]],
    @"location" : [self capability:YES implemented:implemented permissions:@[ @"NSLocationWhenInUseUsageDescription" ]],
    @"biometrics" : [self capability:YES implemented:implemented permissions:@[ @"NSFaceIDUsageDescription" ]],
    @"stepCounter" : [self capability:YES implemented:NO permissions:@[ @"NSMotionUsageDescription" ]],
    @"vitals" : @{
      @"HEART_RATE" : [self capability:YES implemented:implemented permissions:@[]],
      @"SPO2" : [self capability:YES implemented:implemented permissions:@[]],
      @"BP_SYSTOLIC" : [self capability:YES implemented:implemented permissions:@[]],
      @"BP_DIASTOLIC" : [self capability:YES implemented:implemented permissions:@[]],
      @"BODY_TEMP" : [self capability:YES implemented:implemented permissions:@[]],
      @"RESPIRATORY_RATE" : [self capability:YES implemented:implemented permissions:@[]],
    },
  };
}

- (NSDictionary *)capability:(BOOL)available
                 implemented:(BOOL)implemented
                 permissions:(NSArray<NSString *> *)permissions
{
  NSMutableDictionary *map = [@{
    @"available" : @(available),
    @"implemented" : @(implemented),
  } mutableCopy];
  if (permissions.count > 0) {
    map[@"permissionRequired"] = permissions;
  }
  return map;
}

@end
