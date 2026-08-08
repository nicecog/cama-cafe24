#import "CamaNativeBridge.h"
#import "SpeechRecognitionHelper.h"

#import <AVFoundation/AVFoundation.h>
#import <LocalAuthentication/LocalAuthentication.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>
#import <Security/Security.h>
#import <Speech/Speech.h>
#import <UIKit/UIKit.h>

static NSString *const kNotImplemented = @"NOT_IMPLEMENTED";
static NSString *const kPermissionDenied = @"PERMISSION_DENIED";
static NSString *const kUnavailable = @"UNAVAILABLE";
static NSString *const kCancelled = @"CANCELLED";
static NSString *const kSpeechRecognitionEvent = @"CamaSpeechRecognition";
static NSString *const kBiometricService = @"com.camaplus.biometric";
static NSString *const kBiometricAccount = @"refresh_token";
static NSString *const kDeviceIdKey = @"cama_device_id";

@interface CamaNativeBridge () <AVSpeechSynthesizerDelegate, SpeechRecognitionHelperListener, RCTInvalidating>
@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong) AVSpeechSynthesizer *synthesizer;
@property (nonatomic, copy) RCTPromiseResolveBlock speakResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock speakReject;
@property (nonatomic, strong, nullable) SpeechRecognitionHelper *speechHelper;
@end

@implementation CamaNativeBridge

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (void)invalidate
{
  [self.speechHelper destroy];
  self.speechHelper = nil;
}

RCT_EXPORT_METHOD(getCapabilities : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  resolve([self buildCapabilities]);
}

RCT_EXPORT_METHOD(speakText : (NSString *)text rate : (nonnull NSNumber *)rate resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    if (text.length == 0) {
      reject(kNotImplemented, @"INVALID_ARGUMENT", nil);
      return;
    }

    if (!self.synthesizer) {
      self.synthesizer = [[AVSpeechSynthesizer alloc] init];
      self.synthesizer.delegate = self;
    }

    if (self.speakResolve) {
      RCTPromiseResolveBlock previousResolve = self.speakResolve;
      self.speakResolve = nil;
      self.speakReject = nil;
      previousResolve(@YES);
    }

    [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];

    AVSpeechUtterance *utterance = [AVSpeechUtterance speechUtteranceWithString:text];
    AVSpeechSynthesisVoice *voice = [AVSpeechSynthesisVoice voiceWithLanguage:@"ko-KR"];
    if (voice) {
      utterance.voice = voice;
    }

    double normalizedRate = rate.doubleValue;
    if (normalizedRate <= 0) {
      normalizedRate = 0.9;
    }
    utterance.rate = (float)(AVSpeechUtteranceDefaultSpeechRate * normalizedRate);
    utterance.pitchMultiplier = 1.0;
    utterance.volume = 1.0;

    self.speakResolve = resolve;
    self.speakReject = reject;
    [self.synthesizer speakUtterance:utterance];
  });
}

RCT_EXPORT_METHOD(stopSpeech : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    if (self.synthesizer.isSpeaking) {
      [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
    }

    if (self.speakResolve) {
      RCTPromiseResolveBlock previousResolve = self.speakResolve;
      self.speakResolve = nil;
      self.speakReject = nil;
      previousResolve(@YES);
    }

    resolve(@YES);
  });
}

RCT_EXPORT_METHOD(pauseSpeech : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    if (self.synthesizer.isSpeaking) {
      [self.synthesizer pauseSpeakingAtBoundary:AVSpeechBoundaryImmediate];
    }
    resolve(@YES);
  });
}

RCT_EXPORT_METHOD(resumeSpeech : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    if (self.synthesizer.isPaused) {
      [self.synthesizer continueSpeaking];
    }
    resolve(@YES);
  });
}

RCT_EXPORT_METHOD(checkSpeechRecognitionAvailable : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL available = [SpeechRecognitionHelper isRecognitionAvailable];
    resolve(@{
      @"available" : @(available),
      @"implemented" : @YES,
    });
  } @catch (NSException *exception) {
    reject(@"SPEECH_CHECK_ERROR", exception.reason ?: @"check failed", nil);
  }
}

RCT_EXPORT_METHOD(startSpeechRecognition : (NSDictionary *)options resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      if (![SpeechRecognitionHelper isRecognitionAvailable]) {
        reject(kUnavailable, @"Speech recognition is not available on this device", nil);
        return;
      }

      SFSpeechRecognizerAuthorizationStatus speechStatus = [SFSpeechRecognizer authorizationStatus];
      if (speechStatus == SFSpeechRecognizerAuthorizationStatusDenied ||
          speechStatus == SFSpeechRecognizerAuthorizationStatusRestricted) {
        reject(kPermissionDenied, @"Speech recognition permission denied", nil);
        return;
      }

      // TTS와 오디오 세션 충돌 방지
      if (self.synthesizer.isSpeaking || self.synthesizer.isPaused) {
        [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
      }

      NSString *locale = options[@"locale"];
      if (locale.length == 0) {
        locale = @"ko-KR";
      }
      BOOL partialResults = options[@"partialResults"] == nil ? YES : [RCTConvert BOOL:options[@"partialResults"]];
      NSString *prompt = options[@"prompt"] ?: @"말씀해 주세요";
      NSInteger maxDurationMs = options[@"maxDurationMs"] != nil ? [RCTConvert NSInteger:options[@"maxDurationMs"]] : 60000;

      [self.speechHelper destroy];
      self.speechHelper = [[SpeechRecognitionHelper alloc] init];
      self.speechHelper.listener = self;
      [self.speechHelper startWithLocale:locale
                          partialResults:partialResults
                                  prompt:prompt
                           maxDurationMs:maxDurationMs];
      resolve(@YES);
    } @catch (NSException *exception) {
      reject(@"SPEECH_START_ERROR", exception.reason ?: @"start failed", nil);
    }
  });
}

RCT_EXPORT_METHOD(stopSpeechRecognition : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      [self.speechHelper stop];
      resolve(@YES);
    } @catch (NSException *exception) {
      reject(@"SPEECH_STOP_ERROR", exception.reason ?: @"stop failed", nil);
    }
  });
}

RCT_EXPORT_METHOD(cancelSpeechRecognition : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      [self.speechHelper cancel];
      self.speechHelper = nil;
      resolve(@YES);
    } @catch (NSException *exception) {
      reject(@"SPEECH_CANCEL_ERROR", exception.reason ?: @"cancel failed", nil);
    }
  });
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
  LAContext *context = [LAContext new];
  NSError *error = nil;
  BOOL can = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
  BOOL available = can || (error.code == LAErrorBiometryNotEnrolled);
  NSString *type = @"NONE";
  if (can || error.code == LAErrorBiometryNotEnrolled) {
    switch (context.biometryType) {
      case LABiometryTypeFaceID:
        type = @"FACE";
        break;
      case LABiometryTypeTouchID:
        type = @"FINGERPRINT";
        break;
      default:
        type = @"UNKNOWN";
        break;
    }
  }
  resolve(@{
    @"available" : @(available),
    @"enrolled" : @(can),
    @"biometryType" : type,
  });
}

RCT_EXPORT_METHOD(authenticateBiometric : (NSDictionary *)options resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  LAContext *context = [LAContext new];
  NSError *error = nil;
  if (![context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
    reject(kUnavailable, error.localizedDescription ?: @"Biometric unavailable", error);
    return;
  }
  NSString *reason = options[@"reason"] ?: @"본인 확인을 위해 인증해 주세요.";
  [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
          localizedReason:reason
                    reply:^(BOOL success, NSError *_Nullable authError) {
                      if (success) {
                        NSString *type = @"UNKNOWN";
                        if (context.biometryType == LABiometryTypeFaceID) {
                          type = @"FACE";
                        } else if (context.biometryType == LABiometryTypeTouchID) {
                          type = @"FINGERPRINT";
                        }
                        resolve(@{@"authenticated" : @YES, @"biometryType" : type});
                      } else if (authError.code == LAErrorUserCancel || authError.code == LAErrorAppCancel ||
                                 authError.code == LAErrorSystemCancel) {
                        reject(kCancelled, authError.localizedDescription, authError);
                      } else {
                        reject(kUnavailable, authError.localizedDescription, authError);
                      }
                    }];
}

RCT_EXPORT_METHOD(storeBiometricSecret : (NSString *)secret resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  if (secret.length == 0) {
    reject(@"INVALID_ARGUMENT", @"secret required", nil);
    return;
  }
  NSData *data = [secret dataUsingEncoding:NSUTF8StringEncoding];
  NSDictionary *query = @{
    (__bridge id)kSecClass : (__bridge id)kSecClassGenericPassword,
    (__bridge id)kSecAttrService : kBiometricService,
    (__bridge id)kSecAttrAccount : kBiometricAccount,
  };
  SecItemDelete((__bridge CFDictionaryRef)query);
  NSDictionary *add = @{
    (__bridge id)kSecClass : (__bridge id)kSecClassGenericPassword,
    (__bridge id)kSecAttrService : kBiometricService,
    (__bridge id)kSecAttrAccount : kBiometricAccount,
    (__bridge id)kSecValueData : data,
    (__bridge id)kSecAttrAccessible : (__bridge id)kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
  };
  OSStatus status = SecItemAdd((__bridge CFDictionaryRef)add, NULL);
  if (status == errSecSuccess) {
    resolve(@{@"stored" : @YES});
  } else {
    reject(kUnavailable, [NSString stringWithFormat:@"Keychain add failed: %d", (int)status], nil);
  }
}

RCT_EXPORT_METHOD(getBiometricSecret : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  NSDictionary *query = @{
    (__bridge id)kSecClass : (__bridge id)kSecClassGenericPassword,
    (__bridge id)kSecAttrService : kBiometricService,
    (__bridge id)kSecAttrAccount : kBiometricAccount,
    (__bridge id)kSecReturnData : @YES,
    (__bridge id)kSecMatchLimit : (__bridge id)kSecMatchLimitOne,
  };
  CFTypeRef result = NULL;
  OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)query, &result);
  if (status != errSecSuccess || result == NULL) {
    reject(kUnavailable, @"No biometric secret", nil);
    return;
  }
  NSData *data = (__bridge_transfer NSData *)result;
  NSString *secret = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  LAContext *context = [LAContext new];
  NSError *error = nil;
  if (![context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
    reject(kUnavailable, error.localizedDescription ?: @"Biometric unavailable", error);
    return;
  }
  [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
          localizedReason:@"생체 인증으로 로그인합니다."
                    reply:^(BOOL success, NSError *_Nullable authError) {
                      if (success) {
                        resolve(@{@"secret" : secret ?: @""});
                      } else if (authError.code == LAErrorUserCancel || authError.code == LAErrorAppCancel ||
                                 authError.code == LAErrorSystemCancel) {
                        reject(kCancelled, authError.localizedDescription, authError);
                      } else {
                        reject(kUnavailable, authError.localizedDescription, authError);
                      }
                    }];
}

RCT_EXPORT_METHOD(clearBiometricSecret : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  NSDictionary *query = @{
    (__bridge id)kSecClass : (__bridge id)kSecClassGenericPassword,
    (__bridge id)kSecAttrService : kBiometricService,
    (__bridge id)kSecAttrAccount : kBiometricAccount,
  };
  SecItemDelete((__bridge CFDictionaryRef)query);
  resolve(@{@"cleared" : @YES});
}

RCT_EXPORT_METHOD(hasBiometricSecret : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  NSDictionary *query = @{
    (__bridge id)kSecClass : (__bridge id)kSecClassGenericPassword,
    (__bridge id)kSecAttrService : kBiometricService,
    (__bridge id)kSecAttrAccount : kBiometricAccount,
    (__bridge id)kSecReturnData : @NO,
    (__bridge id)kSecMatchLimit : (__bridge id)kSecMatchLimitOne,
  };
  OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)query, NULL);
  resolve(@{@"hasSecret" : @(status == errSecSuccess)});
}

RCT_EXPORT_METHOD(getDeviceId : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  NSString *existing = [[NSUserDefaults standardUserDefaults] stringForKey:kDeviceIdKey];
  if (existing.length > 0) {
    resolve(@{@"deviceId" : existing});
    return;
  }
  NSString *vendor = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
  NSString *deviceId = vendor.length > 0 ? vendor : [[NSUUID UUID] UUIDString];
  [[NSUserDefaults standardUserDefaults] setObject:deviceId forKey:kDeviceIdKey];
  resolve(@{@"deviceId" : deviceId});
}

#pragma mark - SpeechRecognitionHelperListener

- (void)speechRecognitionDidStart
{
  [self emitSpeechRecognitionEvent:@"started" transcript:nil error:nil message:nil];
}

- (void)speechRecognitionDidReceivePartial:(NSString *)transcript
{
  [self emitSpeechRecognitionEvent:@"partial" transcript:transcript error:nil message:nil];
}

- (void)speechRecognitionDidReceiveFinal:(NSString *)transcript
{
  [self emitSpeechRecognitionEvent:@"final" transcript:transcript error:nil message:nil];
}

- (void)speechRecognitionDidEnd
{
  [self emitSpeechRecognitionEvent:@"ended" transcript:nil error:nil message:nil];
  self.speechHelper = nil;
}

- (void)speechRecognitionDidFailWithCode:(NSString *)code message:(NSString *)message
{
  [self emitSpeechRecognitionEvent:@"error" transcript:nil error:code message:message];
}

- (void)emitSpeechRecognitionEvent:(NSString *)event
                        transcript:(NSString *)transcript
                             error:(NSString *)error
                           message:(NSString *)message
{
  NSMutableDictionary *body = [@{@"event" : event ?: @""} mutableCopy];
  if (transcript.length > 0) {
    body[@"transcript"] = transcript;
  }
  if (error.length > 0) {
    body[@"error"] = error;
  }
  if (message.length > 0) {
    body[@"message"] = message;
  }
  // Android DeviceEventEmitter 와 동일 경로
  [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                      method:@"emit"
                        args:@[ kSpeechRecognitionEvent, body ]
                  completion:NULL];
}

#pragma mark - AVSpeechSynthesizerDelegate

- (void)speechSynthesizer:(AVSpeechSynthesizer *)synthesizer
 didFinishSpeechUtterance:(AVSpeechUtterance *)utterance
{
  if (self.speakResolve) {
    RCTPromiseResolveBlock resolve = self.speakResolve;
    self.speakResolve = nil;
    self.speakReject = nil;
    resolve(@YES);
  }
}

- (void)speechSynthesizer:(AVSpeechSynthesizer *)synthesizer
  didCancelSpeechUtterance:(AVSpeechUtterance *)utterance
{
  if (self.speakResolve) {
    RCTPromiseResolveBlock resolve = self.speakResolve;
    self.speakResolve = nil;
    self.speakReject = nil;
    resolve(@YES);
  }
}

#pragma mark - Capabilities

- (NSDictionary *)buildCapabilities
{
  BOOL speechAvailable = [SpeechRecognitionHelper isRecognitionAvailable];
  return @{
    @"platform" : @"ios",
    @"camera" : [self capability:YES implemented:NO permissions:@[ @"NSCameraUsageDescription" ]],
    @"photoLibrary" : [self capability:YES implemented:NO permissions:@[ @"NSPhotoLibraryUsageDescription" ]],
    @"location" : [self capability:YES implemented:NO permissions:@[ @"NSLocationWhenInUseUsageDescription" ]],
    @"biometrics" : [self capability:YES implemented:YES permissions:@[ @"NSFaceIDUsageDescription" ]],
    @"stepCounter" : [self capability:YES implemented:YES permissions:@[ @"NSMotionUsageDescription", @"NSHealthShareUsageDescription" ]],
    @"speechRecognition" : [self capability:speechAvailable
                                implemented:YES
                                permissions:@[
                                  @"NSSpeechRecognitionUsageDescription",
                                  @"NSMicrophoneUsageDescription",
                                ]],
    @"vitals" : @{
      @"HEART_RATE" : [self capability:YES implemented:NO permissions:@[]],
      @"SPO2" : [self capability:YES implemented:NO permissions:@[]],
      @"BP_SYSTOLIC" : [self capability:YES implemented:NO permissions:@[]],
      @"BP_DIASTOLIC" : [self capability:YES implemented:NO permissions:@[]],
      @"BODY_TEMP" : [self capability:YES implemented:NO permissions:@[]],
      @"RESPIRATORY_RATE" : [self capability:YES implemented:NO permissions:@[]],
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
