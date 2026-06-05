import React, { useEffect, useState, useRef } from 'react';
import Tts from 'react-native-tts';
import { LogBox, Platform, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import RectRoundButton from '@/components/Buttons/RectRoundButton';
import { useNavigation } from '@react-navigation/native';
import { ContentsInfo } from '@/services/apis/contents/response';

/** Services **/
import careTrackApi from '@/services/apis/careTrack';
import contentsApi from '@/services/apis/contents';

/** Assets **/
import IC_VOICE_PLAY_D from '@/assets/icons/caretrack/ic_voice_play_disable.svg';
import IC_VOICE_PLAY_E from '@/assets/icons/caretrack/ic_voice_play_enable.svg';
import IC_VOICE_STOP_D from '@/assets/icons/caretrack/ic_voice_stop_disable.svg';
import IC_VOICE_STOP_E from '@/assets/icons/caretrack/ic_voice_stop_enable.svg';
//import IC_FAVORITE_Y from '@/assets/icons/common/ic_favoriteY.svg';
//import IC_FAVORITE_N from '@/assets/icons/common/ic_favoriteN.svg';
import IC_FAVORITE_Y from '@/assets/icons/common/icon_favorite_on.svg';
import IC_FAVORITE_N from '@/assets/icons/common/icon_favorite_off.svg';

import { showAlertMessage } from '@/utils/alertMessage';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

interface Props {
  contentsInfo: ContentsInfo;
  trackServiceSeq: number;
}

function stripTags(str: string) {
  str = str.replace(/(<([^>]+)>)/gi, ''); // 태그 제거
  str = str.replace(/\s\s+/g, ' '); // 연달아 있는 줄바꿈, 공백, 탭을 공백 1개로 줄임
  str = str.replace(/&nbsp;/gi, '');
  str = str.replace(/&amp;/gi, '');
  str = str.replace(/\./gi, '.  ');
  return str;
}

const TtsReadText: React.FC<Props> = ({ contentsInfo, trackServiceSeq }) => {
  Tts.setDefaultLanguage('ko-KR');
  //Tts.setIgnoreSilentSwitch(false);
  //Tts.setDefaultLanguage('en-US');
  //Tts.setDefaultVoice('com.apple.ttsbundle.Moira-compact');
  //Tts.setDefaultRate(0.6);
  const [playType, setPlayType] = useState('S');
  const buttonTitle = ['음성듣기', '멈춤', '다시듣기'];
  const currentPlayType = useRef('S');

  //console.log('text => ' + text);
  const readText = async () => {
    //Tts.voices().then(voices => console.log({ voices }));
    if (Platform.OS === 'ios') {
      //Tts.setIgnoreSilentSwitch(true);
    }
    Tts.stop();
    //Tts.speak('Hello world');
    Tts.getInitStatus().then(() => {
      Tts.speak(stripTags(contentsInfo.contents));
    });
  };
  //console.log('trackServiceSeq 2=> ' + trackServiceSeq);
  //console.log('contentsInfo 2=> ' + JSON.stringify(contentsInfo, null, 2));

  const cancelText = async () => {
    //console.log('cancelText');
    Tts.stop();
  };

  const readRepeatText = async () => {
    Tts.stop();
    Tts.speak(stripTags(contentsInfo.contents));
  };

  const navigation = useNavigation();
  const [favoriteYn, setFavoriteYn] = useState(contentsInfo.favoriteYn);

  const favoriteAdd = () => {
    contentsApi
      .saveFaviriteInfo({
        contentsSeq: contentsInfo.seq,
        type: 'C',
      })
      .catch(err => {
        console.log(err);
        showAlertMessage({
          message: err,
        });
      });

    showAlertMessage({
      message: '즐겨찾기 추가 되었습니다.',
    });
    setFavoriteYn('Y');
  };

  const favoriteDel = () => {
    contentsApi
      .saveFaviriteInfo({
        contentsSeq: contentsInfo.seq,
        type: 'D',
        accountSeq: 0,
      })
      .catch(err => {
        console.log(err);
        showAlertMessage({
          message: err,
        });
      });
    showAlertMessage({
      message: '즐겨찾기 삭제 되었습니다.',
    });
    setFavoriteYn('N');
  };

  useEffect(() => {
    Tts.addEventListener('tts-start', () => {
      //console.log('tts-start addEventListener ' + playType);
      setPlayType('C');
      currentPlayType.current = 'S';
    });
    Tts.addEventListener('tts-finish', () => {
      //console.log('tts-finish addEventListener ');
      setPlayType('R');
      currentPlayType.current = 'F';

      if (trackServiceSeq != null) {
        if (contentsInfo.progress === null || contentsInfo.progress < 100) {
          //console.log('진도율 update PlayType => ' + playType);
          careTrackApi
            .updateCareTrackServiceProgress({
              contentsSeq: contentsInfo.seq,
              progress: 100,
              trackServiceSeq: trackServiceSeq,
            })
            .catch(err => {
              console.log(err);
              showAlertMessage({
                message: err,
              });
            });
        }
      }
    });
    Tts.addEventListener('tts-cancel', () => {
      //console.log('tts-cancel addEventListener ');
      //console.log('tts-cancel addEventListener removeAllListeners');
      setPlayType('S');
      currentPlayType.current = 'C';
    });
    //Tts.addEventListener('tts-progress', event => console.log('progress', event),);

    // 페이지 이동으로 인한 focus 잃어버릴때 실행
    navigation.addListener('blur', () => {
      //console.log('TtsReadText navigation.addListener blur =>');
      //console.log('currentPlayType.current1 => ' + currentPlayType.current);
      //if (currentPlayType.current === 'S')
      cancelText();
    });

    return () => {
      //console.log('removeAllListeners');
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  return (
    <View>
      {/*<RectRoundButton
            label={buttonTitle[0]}
            onPress={readText}
            buttonStyle={{ height: 34, width: 80, margin: 8 }}
            textStyle={{ fontSize: 16, color: '#FFFFFF' }}
          /> */}

      {(playType === 'S' || playType === 'R') && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 0,
            marginRight: 16,
          }}
        >
          <TouchableOpacity onPress={readText}>
            <IC_VOICE_PLAY_E
              width={30}
              height={30}
              style={{ marginRight: 6 }}
            />
          </TouchableOpacity>

          <IC_VOICE_STOP_D width={30} height={30} />

          {favoriteYn === 'Y' && (
            <TouchableOpacity onPress={favoriteDel}>
              <IC_FAVORITE_Y
                width={30}
                height={30}
                style={{ marginRight: 6, marginLeft: 10, marginTop: 2 }}
              />
            </TouchableOpacity>
          )}
          {favoriteYn === 'N' && (
            <TouchableOpacity onPress={favoriteAdd}>
              <IC_FAVORITE_N
                width={30}
                height={30}
                style={{ marginRight: 6, marginLeft: 10, marginTop: 2 }}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {playType === 'C' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 0,
            marginRight: 16,
          }}
        >
          <IC_VOICE_PLAY_D width={30} height={30} style={{ marginRight: 6 }} />
          <TouchableOpacity onPress={cancelText}>
            <IC_VOICE_STOP_E width={30} height={30} />
          </TouchableOpacity>

          {favoriteYn === 'Y' && (
            <TouchableOpacity onPress={favoriteDel}>
              <IC_FAVORITE_Y
                width={30}
                height={30}
                style={{ marginRight: 6, marginLeft: 10 }}
              />
            </TouchableOpacity>
          )}
          {favoriteYn === 'N' && (
            <TouchableOpacity onPress={favoriteAdd}>
              <IC_FAVORITE_N
                width={30}
                height={30}
                style={{ marginRight: 6, marginLeft: 10 }}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default TtsReadText;
