#import "CamaNativeBridge.h"

#import <AVFoundation/AVFoundation.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

static NSString *const kNotImplemented = @"NOT_IMPLEMENTED";

@interface CamaNativeBridge () <AVSpeechSynthesizerDelegate>
@property (nonatomic, strong) AVSpeechSynthesizer *synthesizer;
@property (nonatomic, copy) RCTPromiseResolveBlock speakResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock speakReject;
@end

@implementation CamaNativeBridge

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_METHOD(getCapabilities : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  resolve([self buildCapabilities:NO]);
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

- (NSDictionary *)buildCapabilities:(BOOL)implemented
{
  return @{
    @"platform" : @"ios",
    @"camera" : [self capability:YES implemented:implemented permissions:@[ @"NSCameraUsageDescription" ]],
    @"photoLibrary" : [self capability:YES implemented:implemented permissions:@[ @"NSPhotoLibraryUsageDescription" ]],
    @"location" : [self capability:YES implemented:implemented permissions:@[ @"NSLocationWhenInUseUsageDescription" ]],
    @"biometrics" : [self capability:YES implemented:implemented permissions:@[ @"NSFaceIDUsageDescription" ]],
    @"stepCounter" : [self capability:YES implemented:YES permissions:@[ @"NSMotionUsageDescription", @"NSHealthShareUsageDescription" ]],
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
