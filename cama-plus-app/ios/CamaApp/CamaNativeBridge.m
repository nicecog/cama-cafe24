#import "CamaNativeBridge.h"
#import "SpeechRecognitionHelper.h"

#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>
#import <Speech/Speech.h>

static NSString *const kNotImplemented = @"NOT_IMPLEMENTED";
static NSString *const kPermissionDenied = @"PERMISSION_DENIED";
static NSString *const kUnavailable = @"UNAVAILABLE";
static NSString *const kSpeechRecognitionEvent = @"CamaSpeechRecognition";

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
  reject(kNotImplemented, @"Native bridge stub — implementation pending", nil);
}

RCT_EXPORT_METHOD(authenticateBiometric : (NSDictionary *)options resolver : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  reject(kNotImplemented, @"Native bridge stub — implementation pending", nil);
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
    @"biometrics" : [self capability:YES implemented:NO permissions:@[ @"NSFaceIDUsageDescription" ]],
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
