import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

/** Types **/
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';
import {
  TrackProgressDto,
  TrackProgressGuestDto,
} from '@/services/apis/careTrack/request';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';

/** Hooks **/
import { useDebounce } from '@/hooks/common/useDebounce';

/** Services **/
import careTrackApi from '@/services/apis/careTrack';

/** Styles **/
import { gaugeStyles } from '@/components/_StyleSheets';
import { viewStyles } from '@/components/_StyleSheets';

/** Utils **/
import { showAlertMessage } from '@/utils/alertMessage';
import { patientWebviewUrls } from '@/config/webviewUrls';

/** Assets **/

import TtsReadText from '@/components/Sound/TtsReadText';

interface PageState {
  editorText: string | null;
  progress: number;
}

const ContentsDetailScreen: React.FC<
  MainNavigationScreenProps<'ContentsDetailScreen'>
> = ({
  navigation: { navigate },
  route: {
    params: { contentsInfo, trackServiceSeq },
  },
}) => {
  const [state, setState] = useState<PageState>({
    editorText: null,
    progress: 0,
  });
  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const _onUpdateProgress = (
    prevProgress: number,
    contentOffsetY: number,
    totalHeight: number,
    trackServiceSeq: number,
  ) => {
    const progress = (contentOffsetY / (totalHeight - 100)) * 100;
    const progress2 = progress > 100 ? 100 : progress;

    const dto: TrackProgressDto = {
      contentsSeq: contentsInfo.seq,
      progress: Number(progress2.toFixed(0)),
      trackServiceSeq: trackServiceSeq,
    };

    careTrackApi
      .updateCareTrackServiceProgress(dto)
      .then(res => {
        if (res && prevProgress < dto.progress) {
          changeState({
            progress: dto.progress,
          });
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const onUpdateProgress = useDebounce(_onUpdateProgress);

  const _onUpdateProgressOff = (
    prevProgress: number,
    contentOffsetY: number,
    totalHeight: number,
  ) => {
    const progress = (contentOffsetY / (totalHeight - 100)) * 100;
    const progress2 = progress > 100 ? 100 : progress;

    const dto: TrackProgressGuestDto = {
      contentsSeq: contentsInfo.seq,
      progress: Number(progress2.toFixed(0)),
    };

    careTrackApi
      .updateCareTrackServiceProgressOff(dto)
      .then(res => {
        if (res && prevProgress < dto.progress) {
          changeState({
            progress: dto.progress,
          });
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const onUpdateProgressOff = useDebounce(_onUpdateProgressOff);

  const _checkCompletedProgress = () => {
    if (trackServiceSeq === null) {
      careTrackApi
        .updateCareTrackServiceProgressOff({
          contentsSeq: contentsInfo.seq,
          progress: 100,
        })
        .then(res => {
          changeState({
            progress: 100,
          });
        })
        .catch(err => {
          showAlertMessage({
            message: err,
          });
        });
      return;
    }

    const dto: TrackProgressDto = {
      contentsSeq: contentsInfo.seq,
      progress: 100,
      trackServiceSeq: trackServiceSeq,
    };

    careTrackApi
      .updateCareTrackServiceProgress(dto)
      .then(res => {
        changeState({
          progress: dto.progress,
        });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const checkCompletedProgress = useDebounce(_checkCompletedProgress);

  useEffect(() => {
    //changeState({
    //   progress: Number(contentsInfo.progress),
    // });
    checkCompletedProgress();
  }, []);

  const webViewScript = `
    setTimeout(function() { 
      window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight); 
    }, 2000);
  `;

  const { progress } = state;
  const ttsReadType = true;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={[viewStyles.rowAiCenterJcBetween]}>
        <LeftBackHeader borderBottom={false} title="" />

        {ttsReadType && (
          <TtsReadText
            contentsInfo={contentsInfo}
            trackServiceSeq={trackServiceSeq}
          />
        )}
      </View>

      <View style={[gaugeStyles.gaugeView, { borderRadius: 0, height: 2 }]}>
        <View
          style={[
            gaugeStyles.gaugeFilledView,
            { width: `${progress}%`, borderRadius: 0, height: 2 },
          ]}
        />
      </View>
      <View style={{ flex: 1 }}>
        {/*<View style={[styles.sectionView, borderStyles.borderB]}>*/}
        {/*  <Inter700Text style={{ color: '#000', fontSize: 20 }}>*/}
        {/*    {contentsInfo.title}*/}
        {/*  </Inter700Text>*/}
        {/*  <View style={[viewStyles.rowAiCenter, { marginTop: 16 }]}>*/}
        {/*    <Inter400Text style={{ color: '#000', fontSize: 16, marginRight: 16 }}>*/}
        {/*      {contentsInfo.doctorName}*/}
        {/*      <Inter400Text style={{ color: '#979797', fontSize: 14 }}>*/}
        {/*        {` ${contentsInfo.departmentName}`}*/}
        {/*      </Inter400Text>*/}
        {/*    </Inter400Text>*/}
        {/*  </View>*/}
        {/*  <Inter400Text style={{ color: '#696969', fontSize: 14 }}>*/}
        {/*    {contentsInfo.createdAt}*/}
        {/*  </Inter400Text>*/}
        {/*</View>*/}
        <View style={styles.editorView}>
          <WebView
            source={{
              uri: patientWebviewUrls.treatment(contentsInfo.seq),
            }}
            textZoom={100}
            onScroll={e => {
              /* 상세화면 들어올시 무조건 100 처리
              if (trackServiceSeq !== null) {
                onUpdateProgress(
                  progress,
                  e.nativeEvent.contentOffset.y,
                  e.nativeEvent.contentSize.height -
                    e.nativeEvent.layoutMeasurement.height,
                  trackServiceSeq,
                );
              } else {
                onUpdateProgressOff(
                  progress,
                  e.nativeEvent.contentOffset.y,
                  e.nativeEvent.contentSize.height -
                    e.nativeEvent.layoutMeasurement.height,
                );
              }
                */
            }}
            javaScriptEnabled
            injectedJavaScript={webViewScript}
            onMessage={event => {
              const contentHeight = Number(event.nativeEvent.data);
              if (isNaN(contentHeight)) {
                return;
              }
              if (contentHeight < 800) {
                //상세화면 들어올시 무조건 100 처리
                //checkCompletedProgress();
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ContentsDetailScreen;

const styles = StyleSheet.create({
  sectionView: {
    padding: 16,
  },
  editorView: {
    width: '100%',
    flex: 1,
  },
  emptyView: {
    width: '100%',
    height: 50,
  },
});
