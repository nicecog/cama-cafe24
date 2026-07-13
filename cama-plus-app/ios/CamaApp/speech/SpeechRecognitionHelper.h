#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol SpeechRecognitionHelperListener <NSObject>
- (void)speechRecognitionDidStart;
- (void)speechRecognitionDidReceivePartial:(NSString *)transcript;
- (void)speechRecognitionDidReceiveFinal:(NSString *)transcript;
- (void)speechRecognitionDidEnd;
- (void)speechRecognitionDidFailWithCode:(NSString *)code message:(NSString *)message;
@end

/**
 * iOS SFSpeechRecognizer wrapper — Android SpeechRecognitionHelper 와 동일 콜백 계약.
 * 메인 스레드에서 호출해야 합니다.
 */
@interface SpeechRecognitionHelper : NSObject

@property (nonatomic, weak, nullable) id<SpeechRecognitionHelperListener> listener;

+ (BOOL)isRecognitionAvailable;
+ (BOOL)isRecognitionAvailableForLocale:(NSString *)locale;

- (void)startWithLocale:(NSString *)locale
         partialResults:(BOOL)partialResults
                 prompt:(nullable NSString *)prompt
          maxDurationMs:(NSInteger)maxDurationMs;
- (void)stop;
- (void)cancel;
- (void)destroy;

@end

NS_ASSUME_NONNULL_END
