import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

/** Types **/
import { AuthNavigationScreenProps } from '@/navigations/AuthNavigation';
import { TrackProgressDto, TrackProgressGuestDto } from '@/services/apis/careTrack/request';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';

/** Services **/
import careTrackApi from '@/services/apis/careTrack';

/** Styles **/
import { viewStyles, gaugeStyles, borderStyles } from '@/components/_StyleSheets';
import { Inter700Text, Inter400Text } from '@/components/Texts/InterText';

/** Utils **/
import { patientWebviewUrls } from '@/config/webviewUrls';
import { showAlertMessage } from '@/utils/alertMessage';
import { useDebounce } from '@/hooks/common/useDebounce';

const PreviewContentsDetailScreen: React.FC<
  AuthNavigationScreenProps<'PreviewContentsDetailScreen'>
> = ({
  route: {
    params: { contentsInfo },
  },
}) => {
  const _onUpdateProgressOff = (prevProgress: number, contentOffsetY: number, totalHeight: number) => {
    const progress = (contentOffsetY / (totalHeight - 100)) * 100;
    const progress2 = progress > 100 ? 100 : progress;

    const dto: TrackProgressGuestDto = {
      contentsSeq: contentsInfo.seq,
      progress: Number(progress2.toFixed(0)),
    };

    careTrackApi
      .updateCareTrackServiceProgressGuest(dto)
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  }

  const onUpdateProgressOff = useDebounce(_onUpdateProgressOff);

  const _checkCompletedProgress = () => {
    careTrackApi
      .updateCareTrackServiceProgressGuest({
        contentsSeq: contentsInfo.seq,
        progress: 100,
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  }

  const checkCompletedProgress = useDebounce(_checkCompletedProgress)

  const progress = 0;

  const webViewScript = `
    setTimeout(function() { 
      window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight); 
    }, 2000);
  `;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader borderBottom={false} />
      <View
        style={[gaugeStyles.gaugeView, { borderRadius: 0, height: 2 }]}
      >
        <View
          style={[
            gaugeStyles.gaugeFilledView,
            { width: `${progress}%`, borderRadius: 0, height: 2 }
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
            source={{ uri: patientWebviewUrls.treatment(contentsInfo.seq) }}
            onScroll={e => {
              onUpdateProgressOff(
                progress,
                e.nativeEvent.contentOffset.y,
                e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height,
              );
            }}
            javaScriptEnabled
            injectedJavaScript={webViewScript}
            onMessage={(event) => {
              const contentHeight = Number(event.nativeEvent.data);
              if (isNaN(contentHeight)) {
                return;
              }
              if (contentHeight < 800) {
                checkCompletedProgress();
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PreviewContentsDetailScreen;

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
