import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import LinearGradient from 'react-native-linear-gradient';

/** Types **/
import { MainBottomTabNavigationProps } from '@/navigations/MainBottomTabNavigation';
import { AccountDiseaseAllInfo } from '@/services/apis/AccountDisease/response';
import { CareTrackCheckDto } from '@/services/apis/careTrack/request';
import { NotificationInfo } from '@/services/apis/notification/response';
import { CareTrackAppliedInfo } from '@/services/apis/careTrack/response';

/** Components **/
import NewAlarmCard from '@/screens/MyPage/MainScreen/NewAlarmCard';
import CareTrackInfoModal from '@/screens/MyPage/MainScreen/CareTrackInfoModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import LogoHeader from '@/components/Headers/LogoHeader';

/** Styles **/
import {
  viewStyles,
  modalStyles,
  gaugeStyles,
} from '@/components/_StyleSheets';
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';

/** Hooks **/
import { useAccountHospitalValue } from '@/hooks/recoil/useAccountHospitalRecoilHook';
import { useAccountValue } from '@/hooks/recoil/useAccountMeRecoilState';

/** Services **/
import careTrackApi from '@/services/apis/careTrack';
import notificationApi from '@/services/apis/notification';

/** Utils **/
import { showAlertMessage } from '@/utils/alertMessage';
import { dateDotFormatted } from '@/utils/dayjs';

/** Assets **/
import IC_LABEL_INDICATOR_LG from '@/assets/icons/common/ic_label_indicator_lg.svg';
import IC_PLUS_MARK from '@/assets/icons/buttons/ic_plus_mark.svg';
import IC_INDICATOR_P from '@/assets/icons/buttons/ic_indicator_p.svg';
import IC_MY_INFO from '@/assets/icons/bottomTabs/icon_my_on.svg';
import IC_EXCERCISE from '@/assets/icons/coaching/excercise.svg';
import IC_LIST from '@/assets/icons/common/ic_list.svg';
import IC_NOTI from '@/assets/icons/common/ic_noti.svg';
import IC_FAVORITE_LIST from '@/assets/icons/common/ic_favoriteList.svg';

type ConfirmType = 'STOP_CARE_TRACK' | 'APPLY_CARE_TRACK';

interface PageState {
  showCancerDetail: boolean;
  showConfirmModal: boolean;
  confirmType: ConfirmType;
  targetAccountDiseaseInfo: AccountDiseaseAllInfo | null;
  notificationList: NotificationInfo[];
  appliedCareTrack: boolean;
  careTrackAppliedInfo: CareTrackAppliedInfo | null;
}

const MyPageMainScreen: React.FC<
  MainBottomTabNavigationProps<'MyPageMainScreen'>
> = ({ navigation: { navigate } }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const accountHospital = useAccountHospitalValue();
  const account = useAccountValue();
  const [state, setState] = useState<PageState>({
    showCancerDetail: false,
    showConfirmModal: false,
    confirmType: 'APPLY_CARE_TRACK',
    targetAccountDiseaseInfo: null,
    notificationList: [],
    appliedCareTrack: false,
    careTrackAppliedInfo: null,
  });

  const onStopCareTrack = () => {
    const { careTrackAppliedInfo } = state;

    if (careTrackAppliedInfo === null) {
      return;
    }

    const dto: CareTrackCheckDto = {
      diseaseSeq: careTrackAppliedInfo.diseaseSeq,
      hospitalSeq: accountHospital.hospitalSeq,
    };

    careTrackApi
      .stopCareTrackService(dto)
      .then(res => {
        if (res) {
          showAlertMessage({
            message: '암정보 가이드가 중단되었습니다.',
            onPress: () => {
              fetchData();
              navigation.navigate('HomeMainScreen');
            },
          });
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const initAppliedCareTrackInfo = () => {
    careTrackApi
      .getCareTrackServiceAppliedInfo()
      .then(res => {
        changeState({ careTrackAppliedInfo: res });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const fetchData = () => {
    Promise.all([
      notificationApi.fetchRecentNotificationList(),
      careTrackApi.checkAppliedCareTrackService(),
    ])
      .then(([notificationList, isAppliedCareTack]) => {
        if (isAppliedCareTack) {
          initAppliedCareTrackInfo();
        }
        changeState({
          showConfirmModal: false,
          showCancerDetail: false,
          notificationList,
          appliedCareTrack: isAppliedCareTack,
        });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const {
    showCancerDetail,
    showConfirmModal,
    confirmType,
    notificationList,
    appliedCareTrack,
    careTrackAppliedInfo,
  } = state;

  const process = careTrackAppliedInfo?.process || 0;

  return (
    <SafeAreaView
      style={{ position: 'relative', flex: 1, backgroundColor: '#FFF' }}
    >
      <LogoHeader />
      <ScrollView>
        <LinearGradient
          style={styles.topSection}
          //colors={['rgba(235, 86, 20, 1)', 'rgba(238, 166, 64, 1)']}
          colors={['rgba(153, 153, 204, 0)', 'rgba(153, 153, 204, 0)']}
        >
          {/*
          <TouchableOpacity
            onPress={() => navigate('UserInfoScreen')}
            style={viewStyles.rowAiCenter}
          >
            <Inter700Text style={{ fontSize: 36, color: '#ED7101' }}>
              {account.name}님 >
            </Inter700Text>
            <IC_LABEL_INDICATOR_LG style={{ fontSize: 36, color: '#000' }} />
          </TouchableOpacity>
          <Inter400Text style={{ color: '#000', fontSize: 20, marginTop: 8 }}>
            {accountHospital.hospitalName}
          </Inter400Text>
  */}
        </LinearGradient>
        <View style={[styles.careSection]}>
          <Inter700Text
            style={{ fontSize: 20, color: '#774F2D', paddingHorizontal: 16 }}
          >
            {account.name}님의 암정보 가이드
          </Inter700Text>
          <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
            {!appliedCareTrack && (
              <View
                style={[
                  styles.emptyCardView,
                  viewStyles.columnAiCenterJcBetween,
                ]}
              >
                <Inter400Text style={{ color: '#7E7E7E', fontSize: 16 }}>
                  암정보 가이드를 설정 해주세요.
                </Inter400Text>
                <TouchableOpacity
                  onPress={() => navigate('ApplyCareTrackScreen')}
                  style={[viewStyles.rowAiCenterJcCenter, styles.btnStyle]}
                >
                  <IC_PLUS_MARK />
                  <Inter400Text style={{ color: '#ED7101', fontSize: 16 }}>
                    암정보 가이드 설정하기
                  </Inter400Text>
                </TouchableOpacity>
              </View>
            )}
            {appliedCareTrack && (
              <TouchableOpacity
                onPress={() => changeState({ showCancerDetail: true })}
                style={[styles.careTrackCardView]}
              >
                <View>
                  <Inter400Text style={{ color: '#444444', fontSize: 14 }}>
                    암정보 가이드가 진행중입니다.
                  </Inter400Text>
                  <View style={[viewStyles.rowAiCenter, { marginTop: 10 }]}>
                    <Inter400Text
                      style={{
                        color: '#774F2D',
                        fontSize: 24,
                        textDecorationLine: 'underline',
                      }}
                    >
                      {careTrackAppliedInfo?.diseaseName || ''}
                    </Inter400Text>
                    {/* <IC_INDICATOR_P /> */}
                  </View>
                </View>
                <View>
                  <View style={[gaugeStyles.gaugeView, { marginTop: 10 }]}>
                    <View
                      style={[
                        gaugeStyles.gaugeFilledView,
                        { width: `${process}%` },
                      ]}
                    />
                  </View>
                  <View style={viewStyles.rowAiEndJcBetween}>
                    <Inter400Text style={{ color: '#7E7E7E', fontSize: 14 }}>
                      {dateDotFormatted(
                        careTrackAppliedInfo?.trackCreatedAt || '',
                      )}
                      ~
                    </Inter400Text>
                    <Inter700Text style={{ fontSize: 24, color: '#ED7101' }}>
                      {process === 0 ? 0 : process.toFixed(1)}%
                    </Inter700Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ backgroundColor: '#F9F9F9' }}>
          <Inter700Text
            style={{
              fontSize: 20,
              color: '#774F2D',
              paddingHorizontal: 16,
              marginTop: 20,
              marginBottom: 6,
            }}
          >
            나의메뉴
          </Inter700Text>
          <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
            <TouchableOpacity
              onPress={() => navigate('UserInfoScreen')}
              style={[styles.buttonView]}
            >
              <View style={[viewStyles.rowAiStart, { margin: 4 }]}>
                <IC_MY_INFO width={30} height={30} />
                <Inter400Text
                  style={{ color: '#444444', fontSize: 20, marginLeft: 20 }}
                >
                  내 상세정보
                </Inter400Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
            <TouchableOpacity
              onPress={() => navigate('StepInfoScreen')}
              style={[styles.buttonView]}
            >
              <View style={[viewStyles.rowAiStart, { margin: 4 }]}>
                <IC_EXCERCISE width={30} height={30} />
                <Inter400Text
                  style={{ color: '#444444', fontSize: 20, marginLeft: 20 }}
                >
                  걸음수
                </Inter400Text>
              </View>
            </TouchableOpacity>
          </View>
          {/*
          <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
            <TouchableOpacity
              onPress={() => navigate('MyFavoriteScreen')}
              style={[styles.buttonView]}
            >
              <View style={[viewStyles.rowAiStart, { margin: 4 }]}>
                <IC_FAVORITE_LIST width={30} height={30} />
                <Inter400Text
                  style={{ color: '#444444', fontSize: 20, marginLeft: 20 }}
                >
                  즐겨찾기
                </Inter400Text>
              </View>
            </TouchableOpacity>
          </View>
          */}
          <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
            <TouchableOpacity
              onPress={() => {
                navigate('TermsOfUseServiceScreen', {
                  title: '서비스 이용약관',
                  //uri: 'https://glass-college-44b.notion.site/fb3d9b74c7524072ae4dcc7b52c51231?pvs=4',
                  uri: 'https://upbeat-vicuna-052.notion.site/c62f5d4eb76442f99868f7c3434e20d7?pvs=4',
                });
              }}
              style={[styles.buttonView]}
            >
              <View style={[viewStyles.rowAiStart, { margin: 4 }]}>
                <IC_LIST width={30} height={30} />
                <Inter400Text
                  style={{ color: '#444444', fontSize: 20, marginLeft: 20 }}
                >
                  서비스 이용약관
                </Inter400Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
            <TouchableOpacity
              onPress={() => {
                navigate('TermsOfUseServiceScreen', {
                  title: '개인정보 처리방침',
                  //uri: 'https://glass-college-44b.notion.site/1909744ac3ce4481b8da52796ae15a6f?pvs=4',
                  uri: 'https://upbeat-vicuna-052.notion.site/941c4b7999e54b89be027218ca60ca99?pvs=4',
                });
              }}
              style={[styles.buttonView]}
            >
              <View style={[viewStyles.rowAiStart, { margin: 4 }]}>
                <IC_NOTI width={30} height={30} />
                <Inter400Text
                  style={{ color: '#444444', fontSize: 20, marginLeft: 20 }}
                >
                  개인정보 처리방침
                </Inter400Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.latestAlarmSection]}>
          <Inter700Text
            style={{ fontSize: 20, color: '#774F2D', marginBottom: 8 }}
          >
            최근 알림
          </Inter700Text>
          {notificationList.map((d, idx) => (
            <NewAlarmCard
              key={d.seq}
              message={d.message}
              isLatest={idx === 0}
              alarmDate={dayjs(d.createdAt).format('YYYY.MM.DD')}
            />
          ))}
          {notificationList.length === 0 && (
            <Inter400Text
              style={{
                color: '#000',
                fontSize: 16,
                marginTop: 40,
                textAlign: 'center',
              }}
            >
              최근에 온 알림이 없습니다.
            </Inter400Text>
          )}
        </View>
      </ScrollView>
      <CareTrackInfoModal
        showModal={showCancerDetail}
        careTrackAppliedInfo={careTrackAppliedInfo}
        onStopCareTrack={() => {
          changeState({
            confirmType: 'STOP_CARE_TRACK',
            showConfirmModal: true,
          });
        }}
        onCloseModal={() => changeState({ showCancerDetail: false })}
      >
        <ConfirmModal
          showModal={showConfirmModal}
          cancelLabel={'아니요'}
          doneLabel={'네'}
          onPressDone={() => {
            if (confirmType === 'STOP_CARE_TRACK') {
              onStopCareTrack();
            }
          }}
          onPressCancel={() => changeState({ showConfirmModal: false })}
        >
          {confirmType === 'STOP_CARE_TRACK' && (
            <View>
              <Inter400Text
                style={{
                  color: '#ED7101',
                  fontSize: 26,
                  textAlign: 'center',
                  marginBottom: 10,
                }}
              >
                암정보 가이드 중단
              </Inter400Text>
              <Inter400Text style={modalStyles.msgLabel}>
                암정보 가이드를 정말 {'\n'} 중단할까요?
              </Inter400Text>
            </View>
          )}
        </ConfirmModal>
      </CareTrackInfoModal>
    </SafeAreaView>
  );
};

export default MyPageMainScreen;

const styles = StyleSheet.create({
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 66,
    backgroundColor: '#F9F9F9',
  },
  careSection: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -46,
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: 2,
  },
  latestAlarmSection: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
  },
  emptyCardView: {
    paddingVertical: 44,
    paddingHorizontal: 52,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    backgroundColor: '#FFF',
    height: 172,
  },
  btnStyle: {
    width: 194,
    height: 40,
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
  },
  careTrackCardView: {
    padding: 26,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 172,
  },
  numberOfStepsBtnView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 34,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
    position: 'absolute',
    right: 16,
    bottom: 8,
    backgroundColor: '#FFF',
  },
  buttonView: {
    padding: 11,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 60,
  },
});
