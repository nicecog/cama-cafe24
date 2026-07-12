import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import RNBootSplash from 'react-native-bootsplash';
import messaging from '@react-native-firebase/messaging';
import { WEBVIEW_URL } from '@/config/webviewShell';
import {
  createWebViewMessageHandler,
  getCamaWebViewInjectedJavaScript,
} from '@/utils/webviewBridge';

function App() {
  const webViewRef = useRef<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const appStateRef = useRef(AppState.currentState);

  const recoverBlankWebView = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      (function () {
        try {
          var root = document.getElementById('root');
          var empty =
            !document.body ||
            document.body.childElementCount === 0 ||
            (root && root.childElementCount === 0);
          if (empty) {
            window.location.reload();
            return 'reload';
          }
          return 'ok';
        } catch (e) {
          window.location.reload();
          return 'reload-error';
        }
      })();
      true;
    `);
  }, []);

  const forceReloadWebView = useCallback(() => {
    setHasError(false);
    setReloadKey(current => current + 1);
  }, []);

  const onWebViewMessage = useMemo(
    () => createWebViewMessageHandler(webViewRef),
    [],
  );

  const injectedJavaScript = useMemo(
    () => getCamaWebViewInjectedJavaScript(),
    [],
  );

  useEffect(() => {
    Promise.resolve(RNBootSplash.hide({fade: true})).catch(() => undefined);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const wasBackground =
        appStateRef.current === 'background' ||
        appStateRef.current === 'inactive';
      appStateRef.current = nextState;

      if (wasBackground && nextState === 'active') {
        // 절전/백그라운드 복귀 시 WebView 렌더러가 하얀 화면이 되는 경우 복구
        recoverBlankWebView();
      }
    });

    return () => subscription.remove();
  }, [recoverBlankWebView]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (canGoBack) {
          webViewRef.current?.goBack();
          return true;
        }

        return false;
      },
    );

    return () => subscription.remove();
  }, [canGoBack]);

  useEffect(() => {
    try {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('FCM foreground message', remoteMessage?.messageId);
      });
      return unsubscribe;
    } catch (error) {
      console.log('FCM foreground listener skipped', error);
      return undefined;
    }
  }, []);

  const handleRetry = useCallback(() => {
    forceReloadWebView();
  }, [forceReloadWebView]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.content}>
          <WebView
            key={reloadKey}
            ref={webViewRef}
            testID="patient-webview"
            source={{ uri: WEBVIEW_URL }}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            cacheEnabled
            androidLayerType="hardware"
            startInLoadingState
            injectedJavaScript={injectedJavaScript}
            onMessage={onWebViewMessage}
            webViewDebuggingEnabled={__DEV__}
            onError={() => setHasError(true)}
            onHttpError={() => setHasError(true)}
            onLoadStart={() => setHasError(false)}
            onNavigationStateChange={state => {
              setCanGoBack(state.canGoBack);
            }}
            onRenderProcessGone={() => {
              forceReloadWebView();
              return true;
            }}
            onContentProcessDidTerminate={() => {
              forceReloadWebView();
            }}
            renderLoading={() => (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color="#111111" />
                <Text style={styles.message}>불러오는 중...</Text>
              </View>
            )}
          />
          {hasError ? (
            <View style={styles.errorOverlay}>
              <Text style={styles.errorTitle}>페이지를 불러오지 못했습니다.</Text>
              <Text style={styles.errorMessage}>
                네트워크 상태를 확인한 뒤 다시 시도해주세요.
              </Text>
              <Pressable onPress={handleRetry} style={styles.retryButton}>
                <Text style={styles.retryLabel}>다시 시도</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
  },
  message: {
    fontSize: 15,
    color: '#111111',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555555',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default App;
