#import "SpeechRecognitionHelper.h"

#import <AVFoundation/AVFoundation.h>
#import <Speech/Speech.h>

@interface SpeechRecognitionHelper ()
@property (nonatomic, strong, nullable) SFSpeechRecognizer *recognizer;
@property (nonatomic, strong, nullable) SFSpeechAudioBufferRecognitionRequest *request;
@property (nonatomic, strong, nullable) SFSpeechRecognitionTask *task;
@property (nonatomic, strong, nullable) AVAudioEngine *audioEngine;
@property (nonatomic, assign) BOOL listening;
@property (nonatomic, assign) BOOL partialResultsEnabled;
@property (nonatomic, assign) NSInteger maxDurationMs;
@property (nonatomic, strong, nullable) NSTimer *timeoutTimer;
@property (nonatomic, copy, nullable) NSString *lastPartial;
@end

@implementation SpeechRecognitionHelper

+ (BOOL)isRecognitionAvailable
{
  return [self isRecognitionAvailableForLocale:@"ko-KR"];
}

+ (BOOL)isRecognitionAvailableForLocale:(NSString *)locale
{
  NSString *tag = locale.length > 0 ? locale : @"ko-KR";
  NSLocale *nsLocale = [[NSLocale alloc] initWithLocaleIdentifier:tag];
  SFSpeechRecognizer *probe = [[SFSpeechRecognizer alloc] initWithLocale:nsLocale];
  return probe != nil && probe.isAvailable;
}

- (void)startWithLocale:(NSString *)locale
         partialResults:(BOOL)partialResults
                 prompt:(NSString *)prompt
          maxDurationMs:(NSInteger)maxDurationMs
{
  (void)prompt; // iOS에는 시스템 프롬프트 UI가 없음 — 계약 호환용

  if (self.listening) {
    [self stopInternalCancel:YES emitEnded:NO];
  }

  self.partialResultsEnabled = partialResults;
  self.maxDurationMs = MAX(5000, MIN(120000, maxDurationMs > 0 ? maxDurationMs : 60000));
  self.lastPartial = nil;

  NSString *tag = locale.length > 0 ? locale : @"ko-KR";
  NSLocale *nsLocale = [[NSLocale alloc] initWithLocaleIdentifier:tag];
  self.recognizer = [[SFSpeechRecognizer alloc] initWithLocale:nsLocale];
  if (self.recognizer == nil || !self.recognizer.isAvailable) {
    [self.listener speechRecognitionDidFailWithCode:@"UNAVAILABLE"
                                            message:@"Speech recognition is not available on this device"];
    [self.listener speechRecognitionDidEnd];
    return;
  }

  SFSpeechRecognizerAuthorizationStatus speechStatus = [SFSpeechRecognizer authorizationStatus];
  if (speechStatus == SFSpeechRecognizerAuthorizationStatusDenied ||
      speechStatus == SFSpeechRecognizerAuthorizationStatusRestricted) {
    [self.listener speechRecognitionDidFailWithCode:@"PERMISSION_DENIED"
                                            message:@"Speech recognition permission denied"];
    [self.listener speechRecognitionDidEnd];
    return;
  }

  __weak typeof(self) weakSelf = self;
  void (^beginAfterAuth)(void) = ^{
    __strong typeof(weakSelf) strongSelf = weakSelf;
    if (!strongSelf) {
      return;
    }
    [strongSelf requestMicThenStart];
  };

  if (speechStatus == SFSpeechRecognizerAuthorizationStatusNotDetermined) {
    [SFSpeechRecognizer requestAuthorization:^(SFSpeechRecognizerAuthorizationStatus status) {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (status != SFSpeechRecognizerAuthorizationStatusAuthorized) {
          [weakSelf.listener speechRecognitionDidFailWithCode:@"PERMISSION_DENIED"
                                                      message:@"Speech recognition permission denied"];
          [weakSelf.listener speechRecognitionDidEnd];
          return;
        }
        beginAfterAuth();
      });
    }];
    return;
  }

  beginAfterAuth();
}

- (void)requestMicThenStart
{
  AVAudioSession *session = [AVAudioSession sharedInstance];

  void (^startEngine)(BOOL) = ^(BOOL granted) {
    if (!granted) {
      [self.listener speechRecognitionDidFailWithCode:@"PERMISSION_DENIED"
                                              message:@"Microphone permission denied"];
      [self.listener speechRecognitionDidEnd];
      return;
    }
    NSError *error = nil;
    [self beginRecognitionWithError:&error];
    if (error) {
      [self.listener speechRecognitionDidFailWithCode:@"AUDIO_ERROR"
                                              message:error.localizedDescription ?: @"Audio session error"];
      [self.listener speechRecognitionDidEnd];
    }
  };

  if (@available(iOS 17.0, *)) {
#if __has_include(<AVFAudio/AVAudioApplication.h>)
    AVAudioApplicationRecordPermission perm = [AVAudioApplication sharedInstance].recordPermission;
    if (perm == AVAudioApplicationRecordPermissionDenied) {
      startEngine(NO);
      return;
    }
    if (perm == AVAudioApplicationRecordPermissionUndetermined) {
      [AVAudioApplication requestRecordPermissionWithCompletionHandler:^(BOOL granted) {
        dispatch_async(dispatch_get_main_queue(), ^{
          startEngine(granted);
        });
      }];
      return;
    }
    startEngine(YES);
    return;
#endif
  }

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
  AVAudioSessionRecordPermission perm = session.recordPermission;
  if (perm == AVAudioSessionRecordPermissionDenied) {
    startEngine(NO);
    return;
  }
  if (perm == AVAudioSessionRecordPermissionUndetermined) {
    [session requestRecordPermission:^(BOOL granted) {
      dispatch_async(dispatch_get_main_queue(), ^{
        startEngine(granted);
      });
    }];
    return;
  }
#pragma clang diagnostic pop
  startEngine(YES);
}

- (void)beginRecognitionWithError:(NSError **)outError
{
  AVAudioSession *session = [AVAudioSession sharedInstance];
  NSError *error = nil;
  if (![session setCategory:AVAudioSessionCategoryRecord
                       mode:AVAudioSessionModeMeasurement
                    options:AVAudioSessionCategoryOptionDuckOthers
                      error:&error]) {
    if (outError) {
      *outError = error;
    }
    return;
  }
  if (![session setActive:YES
              withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation
                    error:&error]) {
    if (outError) {
      *outError = error;
    }
    return;
  }

  self.audioEngine = [[AVAudioEngine alloc] init];
  self.request = [[SFSpeechAudioBufferRecognitionRequest alloc] init];
  self.request.shouldReportPartialResults = self.partialResultsEnabled;
  if (@available(iOS 13.0, *)) {
    self.request.requiresOnDeviceRecognition = NO;
  }

  AVAudioInputNode *inputNode = self.audioEngine.inputNode;
  AVAudioFormat *format = [inputNode outputFormatForBus:0];
  if (format.sampleRate == 0 || format.channelCount == 0) {
    if (outError) {
      *outError = [NSError errorWithDomain:@"SpeechRecognitionHelper"
                                      code:1
                                  userInfo:@{NSLocalizedDescriptionKey : @"Invalid audio input format"}];
    }
    return;
  }

  __weak typeof(self) weakSelf = self;
  [inputNode removeTapOnBus:0];
  [inputNode installTapOnBus:0
                  bufferSize:1024
                      format:format
                       block:^(AVAudioPCMBuffer *buffer, AVAudioTime *when) {
                         (void)when;
                         [weakSelf.request appendAudioPCMBuffer:buffer];
                       }];

  self.task = [self.recognizer
      recognitionTaskWithRequest:self.request
                   resultHandler:^(SFSpeechRecognitionResult *_Nullable result, NSError *_Nullable taskError) {
                     __strong typeof(weakSelf) strongSelf = weakSelf;
                     if (!strongSelf) {
                       return;
                     }
                     dispatch_async(dispatch_get_main_queue(), ^{
                       [strongSelf handleResult:result error:taskError];
                     });
                   }];

  [self.audioEngine prepare];
  if (![self.audioEngine startAndReturnError:&error]) {
    [self stopInternalCancel:YES emitEnded:NO];
    if (outError) {
      *outError = error;
    }
    return;
  }

  self.listening = YES;
  [self.listener speechRecognitionDidStart];
  [self scheduleTimeout];
}

- (void)handleResult:(SFSpeechRecognitionResult *)result error:(NSError *)error
{
  if (!self.listening) {
    return;
  }

  if (error) {
    NSString *code = [self mapError:error];
    // 사용자가 stop 한 뒤 cancellation은 soft end
    if ([error.domain isEqualToString:@"kAFAssistantErrorDomain"] && error.code == 216) {
      [self finishWithFinalIfNeeded];
      return;
    }
    if ([code isEqualToString:@"NO_MATCH"] || [code isEqualToString:@"TIMEOUT"]) {
      [self.listener speechRecognitionDidFailWithCode:code message:error.localizedDescription ?: code];
      [self stopInternalCancel:YES emitEnded:YES];
      return;
    }
    [self.listener speechRecognitionDidFailWithCode:code
                                            message:error.localizedDescription ?: @"Speech recognition error"];
    [self stopInternalCancel:YES emitEnded:YES];
    return;
  }

  if (result == nil) {
    return;
  }

  NSString *transcript = result.bestTranscription.formattedString ?: @"";
  if (result.isFinal) {
    self.listening = NO;
    [self clearTimeout];
    [self teardownEngine];
    if (transcript.length > 0) {
      [self.listener speechRecognitionDidReceiveFinal:[transcript stringByTrimmingCharactersInSet:
                                                                     [NSCharacterSet whitespaceAndNewlineCharacterSet]]];
    } else {
      [self.listener speechRecognitionDidFailWithCode:@"NO_MATCH" message:@"No speech match"];
    }
    [self.listener speechRecognitionDidEnd];
    return;
  }

  if (self.partialResultsEnabled && transcript.length > 0) {
    NSString *trimmed = [transcript stringByTrimmingCharactersInSet:
                                        [NSCharacterSet whitespaceAndNewlineCharacterSet]];
    if (trimmed.length > 0 && ![trimmed isEqualToString:self.lastPartial]) {
      self.lastPartial = trimmed;
      [self.listener speechRecognitionDidReceivePartial:trimmed];
    }
  }
}

- (void)finishWithFinalIfNeeded
{
  if (!self.listening) {
    return;
  }
  NSString *text = self.lastPartial;
  self.listening = NO;
  [self clearTimeout];
  [self teardownEngine];
  if (text.length > 0) {
    [self.listener speechRecognitionDidReceiveFinal:text];
  }
  [self.listener speechRecognitionDidEnd];
}

- (void)stop
{
  if (!self.listening) {
    return;
  }
  [self clearTimeout];
  [self.request endAudio];
  // 최종 결과는 recognitionTask 콜백에서 전달
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    if (self.listening) {
      [self finishWithFinalIfNeeded];
    }
  });
}

- (void)cancel
{
  [self stopInternalCancel:YES emitEnded:YES];
}

- (void)destroy
{
  [self stopInternalCancel:YES emitEnded:NO];
}

- (void)stopInternalCancel:(BOOL)cancel emitEnded:(BOOL)emitEnded
{
  [self clearTimeout];
  BOOL wasListening = self.listening;
  self.listening = NO;
  if (cancel) {
    [self.task cancel];
  }
  [self teardownEngine];
  if (emitEnded && wasListening) {
    [self.listener speechRecognitionDidEnd];
  }
}

- (void)teardownEngine
{
  @try {
    [self.audioEngine.inputNode removeTapOnBus:0];
    if (self.audioEngine.isRunning) {
      [self.audioEngine stop];
    }
  } @catch (__unused NSException *exception) {
  }
  self.audioEngine = nil;
  self.request = nil;
  self.task = nil;
  [[AVAudioSession sharedInstance] setActive:NO
                                 withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation
                                       error:nil];
}

- (void)scheduleTimeout
{
  [self clearTimeout];
  __weak typeof(self) weakSelf = self;
  self.timeoutTimer =
      [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval)self.maxDurationMs / 1000.0
                                     repeats:NO
                                       block:^(NSTimer *timer) {
                                         (void)timer;
                                         __strong typeof(weakSelf) strongSelf = weakSelf;
                                         if (!strongSelf || !strongSelf.listening) {
                                           return;
                                         }
                                         [strongSelf.request endAudio];
                                         dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.8 * NSEC_PER_SEC)),
                                                        dispatch_get_main_queue(), ^{
                                                          if (strongSelf.listening) {
                                                            [strongSelf.listener
                                                                speechRecognitionDidFailWithCode:@"TIMEOUT"
                                                                                         message:@"Speech recognition timed out"];
                                                            [strongSelf stopInternalCancel:YES emitEnded:YES];
                                                          }
                                                        });
                                       }];
}

- (void)clearTimeout
{
  [self.timeoutTimer invalidate];
  self.timeoutTimer = nil;
}

- (NSString *)mapError:(NSError *)error
{
  if ([error.domain isEqualToString:NSCocoaErrorDomain] ||
      [error.domain isEqualToString:@"kAFAssistantErrorDomain"]) {
    // 1xx: speech recognition framework codes
    switch (error.code) {
      case 1: // audio
      case 2:
        return @"AUDIO_ERROR";
      case 3: // cancelled by client often
        return @"CLIENT_ERROR";
      case 4:
        return @"PERMISSION_DENIED";
      case 5: // no speech
      case 1110:
        return @"NO_MATCH";
      case 6:
      case 7:
        return @"TIMEOUT";
      case 8:
        return @"BUSY";
      case 9:
      case 10:
        return @"NETWORK_ERROR";
      case 11:
        return @"SERVER_ERROR";
      default:
        break;
    }
  }
  if ([error.localizedDescription.lowercaseString containsString:@"network"]) {
    return @"NETWORK_ERROR";
  }
  if ([error.localizedDescription.lowercaseString containsString:@"permission"]) {
    return @"PERMISSION_DENIED";
  }
  return @"UNKNOWN";
}

@end
