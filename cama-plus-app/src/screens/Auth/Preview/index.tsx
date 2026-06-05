import React, { useState, useEffect, Fragment } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  FlatList,
  ScrollView,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

/** Types **/
import { AuthNavigationScreenProps } from '@/navigations/AuthNavigation';
import { ContentsInfo } from '@/services/apis/contents/response';

/** Components **/
import ContentCard from '@/screens/Home/MainScreen/ContentCard';
import ConfirmModal from '@/components/Modals/ConfirmModal';

/** Services **/
import hospitalApi from '@/services/apis/hospital';
import contentsApi from '@/services/apis/contents';
import authApi from '@/services/apis/auth';

/** Storages **/
import { setTokenEncryptedStorage } from '@/storages/tokenStorage';

/** Hooks **/
import { useSetAccountState } from '@/hooks/recoil/useAccountMeRecoilState';
import { useSetAuthState } from '@/hooks/recoil/useAuthRecoilHooks';

/** Styles **/
import { viewStyles, borderStyles } from '@/components/_StyleSheets';
import FONTS from '@/constants/fonts';
import { Inter700Text, Inter400Text } from '@/components/Texts/InterText';

/** Utils **/
import { showAlertMessage } from '@/utils/alertMessage';

/** Assets **/
import IC_INDICATOR_W from '@/assets/icons/buttons/ic_indicator_w.svg';
import IC_CONFIG from '@/assets/icons/common/ic_config.svg';
import IC_CHA_DAY from '@/assets/icons/coaching/ic_cha_day.svg';
import IC_TODO from '@/assets/icons/coaching/ic_todo.svg';
import IC_COACHING from '@/assets/icons/coaching/ic_coaching.svg';
import IC_ETC from '@/assets/icons/coaching/ic_etc.svg';
import IC_PILL from '@/assets/icons/coaching/ic_pill.svg';
import IC_HOSPITAL from '@/assets/icons/coaching/ic_hospital.svg';
import IC_TODO_OFF from '@/assets/icons/schedules/ic_todo_off.svg';

interface PageState {
  contentsList: ContentsInfo[];
  showConfirmModal: boolean;
  codeText: string;
}

const PreviewScreen: React.FC<AuthNavigationScreenProps<'PreviewScreen'>> = ({
  navigation: { navigate, goBack },
}) => {
  const setAuthState = useSetAuthState();
  const setAccountState = useSetAccountState();
  const [state, setState] = useState<PageState>({
    contentsList: [],
    showConfirmModal: false,
    codeText: '',
  });

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const onSecureLogin = async () => {
    try {
      const { codeText } = state;

      const resp = await authApi.loginSecure({ secureCode: codeText });

      const { account, apiToken } = resp;

      await setTokenEncryptedStorage(apiToken);
      setAccountState(account);

      const serviceType = await hospitalApi.checkHospitalService();

      changeState({ showConfirmModal: false });
      setTimeout(() => {
        if (serviceType === 'NOT_SERVICE') {
          setAuthState('selectInfo');
        } else {
          setAuthState('loggedIn');
        }
      }, 1000);
    } catch (err) {
      showAlertMessage({
        message: JSON.stringify(err),
      });
    }
  };

  const fetchData = () => {
    contentsApi
      .fetchContentsList()
      .then(res => {
        changeState({ contentsList: res.filter(d => !!d.viewed) });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { contentsList, showConfirmModal, codeText } = state;

  return (
    <SafeAreaView
      style={{ position: 'relative', flex: 1, backgroundColor: '#FFF' }}
    >
      <FlatList
        data={contentsList}
        keyExtractor={item => `${item.seq}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingHorizontal: 16 }}
            onPress={() => {
              navigate('PreviewContentsDetailScreen', {
                contentsInfo: item,
              });
            }}
          >
            <ContentCard contentsInfo={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View
            style={[
              { flex: 1, marginTop: 120 },
              viewStyles.rowAiCenterJcCenter,
            ]}
          >
            <Inter400Text style={{ fontSize: 18, color: '#B6BDC3' }}>
              데이터가 없습니다.
            </Inter400Text>
          </View>
        }
        ListHeaderComponent={
          <Fragment>
            <LinearGradient
              style={styles.topSection}
              //colors={['rgba(235, 86, 20, 1)', 'rgba(238, 166, 64, 1)']}
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)']}
            >
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.config, viewStyles.rowAiCenterJcCenter]}
                  onPress={() =>
                    changeState({ showConfirmModal: true, codeText: '' })
                  }
                >
                  <IC_CONFIG />
                </TouchableOpacity>
              )}
              <View style={{ marginTop: 80 }}>
                <Inter400Text
                  style={{
                    fontSize: 20,
                    color: '#444444',
                    paddingHorizontal: 16,
                  }}
                >
                  반갑습니다.
                </Inter400Text>
                <View style={[viewStyles.rowAiEndJcBetween]}>
                  <Inter700Text
                    style={{
                      fontSize: 26,
                      color: '#000000',
                      paddingHorizontal: 16,
                    }}
                  >
                    CAMA입니다.
                  </Inter700Text>

                  <TouchableOpacity onPress={goBack} style={[styles.btnView]}>
                    <Inter400Text style={{ color: '#FFFFFF', fontSize: 18 }}>
                      로그인하기
                    </Inter400Text>
                  </TouchableOpacity>
                </View>

                <Inter400Text
                  style={{
                    fontSize: 20,
                    color: '#444444',
                    paddingHorizontal: 16,
                    paddingTop: 40,
                  }}
                >
                  로그인 후 이용하세요!
                </Inter400Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.cardSection}
              >
                <View style={{ width: 16 }} />
                <View style={[styles.svcWrap, borderStyles.basicBorder]}>
                  <Inter700Text
                    style={{
                      fontSize: 20,
                      color: '#FEBA00',
                      marginLeft: 2,
                      marginBottom: 14,
                    }}
                  >
                    암정보 가이드
                  </Inter700Text>
                  <Inter400Text
                    style={{ color: '#444444', fontSize: 16, marginLeft: 2 }}
                  >
                    암정보 가이드의 남은 날짜를 확인할 수 있어요.
                  </Inter400Text>
                  <View style={{ paddingTop: 10, paddingLeft: 30 }}>
                    <IC_CHA_DAY width={70} height={70} />
                  </View>
                </View>
                <View style={[styles.svcWrap, borderStyles.basicBorder]}>
                  <Inter700Text
                    style={{
                      fontSize: 20,
                      color: '#FEBA00',
                      marginLeft: 2,
                      marginBottom: 14,
                    }}
                  >
                    일정관리
                  </Inter700Text>
                  <Inter400Text
                    style={{ color: '#444444', fontSize: 16, marginLeft: 2 }}
                  >
                    치료에 필요한 일정과 복약시간을 관리하세요.
                  </Inter400Text>
                  <View style={{ paddingTop: 10, paddingLeft: 30 }}>
                    <IC_TODO width={70} height={70} />
                  </View>
                </View>
                <View style={[styles.svcWrap, borderStyles.basicBorder]}>
                  <Inter700Text
                    style={{
                      fontSize: 20,
                      color: '#FEBA00',
                      marginLeft: 2,
                      marginBottom: 14,
                    }}
                  >
                    건강코칭
                  </Inter700Text>
                  <Inter400Text
                    style={{ color: '#444444', fontSize: 16, marginLeft: 2 }}
                  >
                    수면, 식습관, 운동등 맞춤 코칭으로 건강을 관리하세요.
                  </Inter400Text>
                  <View style={{ paddingTop: 10, paddingLeft: 30 }}>
                    <IC_COACHING width={70} height={70} />
                  </View>
                </View>
              </ScrollView>
              <View style={[styles.wrap]}>
                <Inter700Text
                  style={{
                    fontSize: 26,
                    color: '#444444',
                  }}
                >
                  일일미션!
                </Inter700Text>
                <View style={[viewStyles.rowAiEndJcBetween]}>
                  <Inter400Text
                    style={{
                      fontSize: 20,
                      color: '#444444',
                      paddingTop: 10,
                    }}
                  >
                    오늘 할일을 달성하고 체크하세요!
                  </Inter400Text>
                  <View>
                    <Inter700Text
                      style={{
                        fontSize: 22,
                        color: '#444444',
                        paddingTop: 10,
                        paddingLeft: 30,
                      }}
                    >
                      0/3
                    </Inter700Text>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.cardSection}
                >
                  <View style={{ width: 16 }} />
                  <View style={[styles.missionWrap, borderStyles.basicBorder]}>
                    <View style={[viewStyles.rowAiEndJcBetween]}>
                      <Inter700Text
                        style={{
                          fontSize: 20,
                          color: '#FE8825',
                          marginLeft: 2,
                          marginBottom: 14,
                        }}
                      >
                        복약하기
                      </Inter700Text>
                      <Inter400Text
                        style={{
                          fontSize: 20,
                          color: '#444444',
                          marginLeft: 2,
                          marginBottom: 14,
                        }}
                      >
                        9:00
                      </Inter400Text>
                    </View>
                    <Inter400Text
                      style={{ color: '#444444', fontSize: 14, marginLeft: 2 }}
                    >
                      매일 건강해 지는 습관!
                    </Inter400Text>
                    <Inter400Text
                      style={{ color: '#444444', fontSize: 14, marginLeft: 2 }}
                    >
                      약을 꼭 챙겨드세요!
                    </Inter400Text>
                    <View
                      style={[
                        { paddingTop: 20 },
                        viewStyles.rowAiCenterJcBetween,
                      ]}
                    >
                      <IC_PILL width={70} height={70} />
                      <IC_TODO_OFF width={50} height={50} />
                    </View>
                  </View>
                  <View style={[styles.missionWrap, borderStyles.basicBorder]}>
                    <View style={[viewStyles.rowAiEndJcBetween]}>
                      <Inter700Text
                        style={{
                          fontSize: 20,
                          color: '#FE8825',
                          marginLeft: 2,
                          marginBottom: 14,
                        }}
                      >
                        내원하기
                      </Inter700Text>
                      <Inter400Text
                        style={{
                          fontSize: 20,
                          color: '#444444',
                          marginLeft: 2,
                          marginBottom: 14,
                        }}
                      >
                        11:00
                      </Inter400Text>
                    </View>
                    <Inter400Text
                      style={{ color: '#444444', fontSize: 14, marginLeft: 2 }}
                    >
                      정기적인 건강검진
                    </Inter400Text>
                    <Inter400Text
                      style={{ color: '#444444', fontSize: 14, marginLeft: 2 }}
                    >
                      병원에 내원 하세요!
                    </Inter400Text>
                    <View
                      style={[
                        { paddingTop: 20 },
                        viewStyles.rowAiCenterJcBetween,
                      ]}
                    >
                      <IC_HOSPITAL width={70} height={70} />
                      <IC_TODO_OFF width={50} height={50} />
                    </View>
                  </View>
                  <View style={[styles.missionWrap, borderStyles.basicBorder]}>
                    <View style={[viewStyles.rowAiEndJcBetween]}>
                      <Inter700Text
                        style={{
                          fontSize: 20,
                          color: '#FE8825',
                          marginLeft: 2,
                          marginBottom: 14,
                        }}
                      >
                        기타
                      </Inter700Text>
                      <Inter400Text
                        style={{
                          fontSize: 20,
                          color: '#444444',
                          marginLeft: 2,
                          marginBottom: 14,
                        }}
                      >
                        1:30
                      </Inter400Text>
                    </View>
                    <Inter400Text
                      style={{ color: '#444444', fontSize: 14, marginLeft: 2 }}
                    >
                      운동으로 활기찬!
                    </Inter400Text>
                    <Inter400Text
                      style={{ color: '#444444', fontSize: 14, marginLeft: 2 }}
                    >
                      하루를 시작하세요!
                    </Inter400Text>
                    <View
                      style={[
                        { paddingTop: 20 },
                        viewStyles.rowAiCenterJcBetween,
                      ]}
                    >
                      <IC_ETC width={70} height={70} />
                      <IC_TODO_OFF width={50} height={50} />
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={[{ paddingTop: 20, paddingLeft: 20 }]}>
                <Inter700Text
                  style={{
                    fontSize: 26,
                    color: '#444444',
                  }}
                >
                  오늘의 맞춤 암정보 가이드
                </Inter700Text>
                <Inter400Text
                  style={{
                    fontSize: 20,
                    color: '#444444',
                    paddingTop: 10,
                  }}
                >
                  다양하고 유익한 정보를 확인하세요!
                </Inter400Text>
              </View>
            </LinearGradient>
            <View style={[styles.contentSection]} />
          </Fragment>
        }
      />
      <ConfirmModal
        showModal={showConfirmModal}
        cancelLabel={'취소'}
        doneLabel={'확인'}
        onPressDone={() => {
          onSecureLogin();
        }}
        onPressCancel={() => {
          changeState({ showConfirmModal: false });
        }}
      >
        <Fragment>
          <Inter400Text
            style={{
              fontSize: 20,
              color: '#000',
              textAlign: 'center',
            }}
          >
            관리자 권한으로 접근하시겠습니까?
          </Inter400Text>
          <TextInput
            value={codeText}
            placeholder={'관리자 코드를 입력해주세요'}
            onChangeText={text => changeState({ codeText: text })}
            placeholderTextColor={'#B6BDC3'}
            style={{
              color: '#000',
              fontSize: 18,
              fontFamily: FONTS.Inter.Regular,
              marginTop: 12,
              marginBottom: 16,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: '#666666',
              borderRadius: 4,
            }}
          />
        </Fragment>
      </ConfirmModal>
    </SafeAreaView>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  topSection: {
    paddingBottom: 60,
  },
  contentSection: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
    padding: 0,
    backgroundColor: '#FFF',
  },
  config: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
  },
  btnView: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
    position: 'absolute',
    right: 20,
    bottom: 0,
    backgroundColor: '#ED7101',
  },
  cardSection: {
    marginTop: 20,
  },
  svcWrap: {
    width: 170,
    height: 230,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
  wrap: {
    width: '100%',
    height: 360,
    padding: 18,
    backgroundColor: '#F9F9F9',
    marginTop: 40,
  },
  missionWrap: {
    width: 180,
    height: 210,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
});
