import React, { useState, useEffect, Fragment, useRef } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import dayjs from 'dayjs';
import { useIsFocused } from '@react-navigation/native';
import { pipe, map, range, toArray } from '@fxts/core';
import LinearGradient from 'react-native-linear-gradient';

/** Types **/
import { MainBottomTabNavigationProps } from '@/navigations/MainBottomTabNavigation';
import { ContentsInfo } from '@/services/apis/contents/response';
import { AccountHospitalInfo } from '@/services/apis/account/Response';
import { AccountDiseaseInfo } from '@/services/apis/AccountDisease/response';
import { CareTrackInfoDto } from '@/services/apis/careTrack/request';
import { ScheduleInfo } from '@/services/apis/scheduleManager/response';
import { CoachingInfoRequest } from '@/services/apis/coaching/request';
import { CoachingInfoReponse } from '@/services/apis/coaching/response';
import {
  CareTrackDoneInfo,
  CareTrackAppliedInfo,
} from '@/services/apis/careTrack/response';

/** Components **/
import ContentCard from '@/screens/Home/MainScreen/ContentCard';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import ScheduleCard from '@/screens/Home/MainScreen/ScheduleCard';
import CoachingCard from '@/screens/Home/MainScreen/CoachingCard';
import LoadingView from '@/components/Loaders/LoadingView';
import LogoHeader from '@/components/Headers/LogoHeader';

/** Hooks **/
import { useSetAuthState } from '@/hooks/recoil/useAuthRecoilHooks';
import { useAccountValue } from '@/hooks/recoil/useAccountMeRecoilState';
import { useSetAccountHospitalState } from '@/hooks/recoil/useAccountHospitalRecoilHook';

/** Styles **/
import FONTS from '@/constants/fonts';
import {
  viewStyles,
  gaugeStyles,
  modalStyles,
  borderStyles,
} from '@/components/_StyleSheets';
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';

/** Services **/
import hospitalApi from '@/services/apis/hospital';
import contentsApi from '@/services/apis/contents';
import accountApi from '@/services/apis/account';
import careTrackApi from '@/services/apis/careTrack';
import scheduleManagerApi from '@/services/apis/scheduleManager';
import coachingInfoApi from '@/services/apis/coaching';

/** Helpers **/
import { WEEKDAY } from '@/utils/dayjs';
import { showAlertMessage } from '@/utils/alertMessage';
import { scheduleLabel } from '@/constants/enumHelpers';
import { dateSplit } from '@/utils/dayjs';

/** Assets **/
import IC_ARROW_RIGHT from '@/assets/icons/common/ic_arrow_right.svg';
import IC_SEARCH from '@/assets/icons/common/ic_search.svg';
import IC_COMPLETED_CHECK_MARK from '@/assets/icons/common/ic_completed_check_mark.svg';
import IC_ETC from '@/assets/icons/coaching/ic_etc.svg';
import IC_ADD_MARK from '@/assets/icons/schedules/ic_add.svg';

type ConfirmType = 'CANCEL_APPLYING' | 'APPLY_CARE_TRACK';

interface CareTrackCheckDays {
  days: number;
  day: string;
  weekDay: number;
  isToday: boolean;
  isCompleted: boolean;
  date: string;
}

interface PageState {
  selectedDisease: AccountDiseaseInfo[];
  searchText: string;
  showConfirmModal: boolean;
  confirmType: ConfirmType;
  appliedCareTrack: boolean;
  careTrackCheckDays: CareTrackCheckDays[];
  loading: boolean;
  contentsList: ContentsInfo[];
  hospitalInfo: AccountHospitalInfo | null; // TEMP
  careTrackList: ContentsInfo[];
  scheduleList: ScheduleInfo[];
  coachingProgressList: CoachingInfoReponse[];
  careTrackAppliedInfo: CareTrackAppliedInfo | null;
  targetDays: number;
  targetDate: string;
  showRemovedMsg: boolean;
}

const HomeMainScreen: React.FC<
  MainBottomTabNavigationProps<'HomeMainScreen'>
> = ({ navigation: { navigate } }) => {
  const isFocused = useIsFocused();
  const account = useAccountValue();
  const setAuthState = useSetAuthState();
  const setAccountHospital = useSetAccountHospitalState();
  const scrollRef = useRef();
  const [state, setState] = useState<PageState>({
    selectedDisease: [],
    searchText: '',
    showConfirmModal: false,
    confirmType: 'CANCEL_APPLYING',
    appliedCareTrack: false,
    careTrackCheckDays: [],
    loading: true,
    contentsList: [],
    hospitalInfo: null,
    careTrackList: [],
    scheduleList: [],
    coachingProgressList: [],
    careTrackAppliedInfo: null,
    targetDays: 1,
    targetDate: dayjs().format('YYYY-MM-DD'),
    showRemovedMsg: false,
  });

  const onCancelService = () => {
    const { hospitalInfo } = state;

    if (hospitalInfo === null) {
      return;
    }

    hospitalApi
      .cancelHospitalService(hospitalInfo.hospitalSeq)
      .then(res => {
        if (res) {
          changeState({
            showConfirmModal: false,
          });
          setTimeout(() => {
            setAuthState('selectInfo');
          }, 500);
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

  const getDays = (startDate: string) => {
    if (startDate === '') {
      return '0';
    }

    const today = dayjs().format('YYYY-MM-DD');
    const startDay = dayjs(today).diff(dayjs(startDate), 'days');
    return `${startDay + 1}`;
  };

  const getTargetDays = (startDate: string, targetDate: string) => {
    if (startDate === '') {
      return '0';
    }

    const startDay = dayjs(targetDate).diff(dayjs(startDate), 'days');
    return `${startDay + 1}`;
  };

  const onApplyCareTrack = () => {
    const { hospitalInfo } = state;

    if (hospitalInfo === null) {
      return;
    }

    changeState({ showConfirmModal: false });

    setTimeout(() => {
      navigate('ApplyCareTrackScreen');
    }, 500);
  };

  const isDisabledSchedule = (today: string, tDate: string) => {
    const diff = dayjs(today).diff(dayjs(tDate), 'days');
    return diff < 0;
  };

  const updateScheduleList = () => {
    const { targetDate } = state;
    scheduleManagerApi
      .getSchedule(targetDate)
      .then(res => {
        changeState({
          scheduleList: res,
        });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const moveCategory = (categoryCd: string) => {
    console.log(categoryCd);
    navigate('HealthCoachingCategoryScreen', { categoryCd: categoryCd });
  };

  const checkScheduleDone = (scheduleInfo: ScheduleInfo) => {
    scheduleManagerApi
      .checkDoneSchedule(scheduleInfo.batchSeq)
      .then(res => {
        if (res) {
          updateScheduleList();
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const checkUnDoneSchedule = (scheduleInfo: ScheduleInfo) => {
    //console.log(
    //  'checkUnDoneSchedule => ' + JSON.stringify(scheduleInfo, null, 2),
    //);
    scheduleManagerApi
      .checkUnDoneSchedule(scheduleInfo.batchSeq)
      .then(res => {
        if (res) {
          updateScheduleList();
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const onChangeCategoryCd = (categoryCd: string) => {
    console.log(categoryCd);
  };

  const onChangeTargetDay = async (targetDay: number, targetDate: string) => {
    try {
      const { careTrackAppliedInfo, hospitalInfo } = state;
      if (careTrackAppliedInfo === null || hospitalInfo === null) {
        return;
      }

      const isAppliedCareTack =
        await careTrackApi.checkAppliedCareTrackService();
      if (isAppliedCareTack) {
        const careTrackInfoDto: CareTrackInfoDto = {
          day: targetDay,
          diseaseSeq: careTrackAppliedInfo.diseaseSeq,
          hospitalSeq: hospitalInfo.hospitalSeq,
        };

        const careTrackDoneInfoDto: CareTrackInfoDto = {
          day: careTrackAppliedInfo.days,
          diseaseSeq: careTrackAppliedInfo.diseaseSeq,
          hospitalSeq: hospitalInfo.hospitalSeq,
        };

        const scheduleList = await scheduleManagerApi.getSchedule(targetDate);
        const careTrackList = await careTrackApi.fetchCareTrackServiceList(
          careTrackInfoDto,
        );
        const doneList = await careTrackApi.checkDoneCareTrackService(
          careTrackDoneInfoDto,
        );

        const careTrackCheckDays = getCareTrackCheckDays(
          doneList,
          careTrackAppliedInfo,
        );

        changeState({
          scheduleList,
          careTrackList,
          careTrackCheckDays: careTrackCheckDays,
          targetDays: targetDay,
          targetDate: targetDate,
        });
      } else {
        changeState({
          appliedCareTrack: false,
        });
      }
    } catch (err) {
      showAlertMessage({
        message: JSON.stringify(err),
      });
    }
  };

  const initAppliedCareTrackServices = async (
    hospitalInfo: AccountHospitalInfo,
  ) => {
    try {
      const hSeq = hospitalInfo.hospitalSeq;
      const isAppliedCareTack =
        await careTrackApi.checkAppliedCareTrackService();

      if (isAppliedCareTack) {
        /** 암정보 가이드 여정 신청한 경우 **/
        const { targetDate } = state;
        const appliedInfo = await careTrackApi.getCareTrackServiceAppliedInfo();
        const targetDays = getTargetDays(
          dateSplit(appliedInfo.trackCreatedAt),
          targetDate,
        );

        const careTrackInfoDto: CareTrackInfoDto = {
          day: Number(targetDays),
          diseaseSeq: appliedInfo.diseaseSeq,
          hospitalSeq: hSeq,
        };

        const careTrackDoneInfoDto: CareTrackInfoDto = {
          day: appliedInfo.days, //  기간
          diseaseSeq: appliedInfo.diseaseSeq,
          hospitalSeq: hSeq,
        };

        const scheduleList = await scheduleManagerApi.getSchedule(targetDate);
        const careTrackList = await careTrackApi.fetchCareTrackServiceList(
          careTrackInfoDto,
        );
        const doneList = await careTrackApi.checkDoneCareTrackService(
          careTrackDoneInfoDto,
        );

        const careTrackCheckDays = getCareTrackCheckDays(doneList, appliedInfo);
        changeState({
          scheduleList,
          careTrackList: careTrackList.filter(d => !!d.viewed),
          targetDays: Number(targetDays),
          careTrackCheckDays: careTrackCheckDays,
          careTrackAppliedInfo: appliedInfo,
          hospitalInfo,
          appliedCareTrack: true,
          loading: false,
        });
      } else {
        /** 암정보 가이드 여정 신청 안한 경우 **/
        const contentsList = await contentsApi.fetchContentsList();
        // console.log('contentsList => ' + JSON.stringify(contentsList, null, 2));
        changeState({
          hospitalInfo,
          contentsList: contentsList.filter(d => !!d.viewed),
          appliedCareTrack: false,
          loading: false,
          targetDays: 1,
          targetDate: dayjs().format('YYYY-MM-DD'),
        });
      }
    } catch (err) {
      showAlertMessage({
        message: JSON.stringify(err),
        onPress: () => {
          changeState({
            loading: false,
          });
        },
      });
    }
  };

  const getCareTrackCheckDays = (
    careTrackDoneList: CareTrackDoneInfo[],
    appliedInfo: CareTrackAppliedInfo,
  ) => {
    const daysInfo = appliedInfo.days;
    const doneList = careTrackDoneList.sort((a, b) => (a.day > b.day ? 1 : -1));

    const today = dayjs(dayjs().format('YYYY-MM-DD'));
    const startDay = dayjs(dateSplit(appliedInfo.trackCreatedAt));

    const diff = today.diff(startDay, 'days');

    const careTrackCheckDays: CareTrackCheckDays[] = pipe(
      range(daysInfo),
      map(d => d - diff),
      toArray,
    )
      .map(d => today.add(d, 'day'))
      .map((d, idx) => ({
        days: idx + 1,
        day: d.format('DD'),
        weekDay: d.get('days'), // weeDay: [0, 6]
        isToday: d.format('YYYY-MM-DD') === today.format('YYYY-MM-DD'),
        isCompleted:
          doneList[idx] !== undefined ? doneList[idx].progress === 100 : false,
        date: d.format('YYYY-MM-DD'),
      }));

    return careTrackCheckDays;
  };

  const fetchData = () => {
    accountApi.getAccountHospital().then(hospitalInfo => {
      initAppliedCareTrackServices(hospitalInfo);
      setAccountHospital(hospitalInfo);
    });

    const coachingInfoRequest: CoachingInfoRequest = {
      loginId: account.loginId,
      categoryCd: '',
      stepDayCd: '',
      progressTypeCd: '',
    };

    Promise.all([
      coachingInfoApi.fetchCoachingProgressList(coachingInfoRequest),
    ])
      .then(([coachingProgressList]) => {
        changeState({
          coachingProgressList,
        });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const dayStr = (d: CareTrackCheckDays, index: number) => {
    if (!d.isToday && index === 0) {
      return 'Start';
    } else if (d.isToday) {
      return 'Today';
    } else if (!d.isToday && index + 1 === careTrackCheckDays.length) {
      return 'End';
    } else if (
      !d.isToday &&
      index !== 0 &&
      index + 1 !== careTrackCheckDays.length
    ) {
      return 'Day';
    }
  };

  useEffect(() => {
    if (isFocused) {
      changeState({ loading: true });
      fetchData();
    }
  }, [isFocused]);

  const {
    selectedDisease,
    searchText,
    showConfirmModal,
    confirmType,
    appliedCareTrack,
    careTrackCheckDays,
    loading,
    contentsList,
    careTrackList,
    scheduleList,
    coachingProgressList,
    careTrackAppliedInfo,
    targetDays,
    targetDate,
    showRemovedMsg,
  } = state;

  // const completedCount = careTrackList.filter(d => d.progress === 100).length;
  const doneCount = scheduleList.filter(d => d.done).length;
  const scheduleSize = scheduleList.length;
  const doneProgress =
    scheduleSize === 0 ? 0 : ((doneCount / scheduleSize) * 100).toFixed(0);
  // const careTrackSize = careTrackList.length;
  // const contentProgress = careTrackSize === 0 ? 0 : ((completedCount/careTrackSize)*100).toFixed(0);

  const progressSum = careTrackList
    .map(d => d.progress || 0)
    .reduce((a, b) => a + b, 0);

  const daySize = careTrackCheckDays.length;
  const currDayCnt = getDays(
    careTrackAppliedInfo === null
      ? ''
      : dateSplit(careTrackAppliedInfo.trackCreatedAt),
  );
  const doneDayCount = daySize - currDayCnt;

  const doneDayProgress =
    doneDayCount === 0 || daySize === 0
      ? 0
      : ((currDayCnt / daySize) * 100).toFixed(0);

  const contentProgress = (progressSum / careTrackList.length).toFixed(0);
  const today = dayjs().format('YYYY-MM-DD');
  //console.log(JSON.stringify(careTrackCheckDays, null, 2));
  //console.log(
  //  'coachingProgressList => ' + JSON.stringify(coachingProgressList, null, 2),
  //);

  return (
    <SafeAreaView
      style={{ position: 'relative', flex: 1, backgroundColor: '#FFF' }}
    >
      <LogoHeader />
      {/** 오늘의 암정보 가이드 & 오늘 할일 - 암정보 가이드 여정 생성 전 **/}
      <Fragment>
        {!appliedCareTrack && (
          <FlatList
            data={contentsList}
            keyExtractor={item => `${item.seq}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigate('ContentsDetailScreen', {
                    contentsInfo: item,
                    trackServiceSeq: null,
                  });
                }}
                style={{ paddingHorizontal: 20 }}
              >
                <ContentCard contentsInfo={item} />
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <Fragment>
                <LinearGradient
                  style={styles.topSection}
                  // colors={['rgba(235, 86, 20, 1)', 'rgba(238, 166, 64, 1)']}
                  colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)']}
                >
                  <View style={{ marginTop: 20 }}>
                    <Inter700Text
                      style={{
                        fontSize: 36,
                        color: '#000000',
                        paddingHorizontal: 16,
                      }}
                    >
                      {account.name}님
                    </Inter700Text>
                    <View style={{ paddingHorizontal: 16 }}>
                      <Inter700Text
                        style={{ fontSize: 18, color: '#000000', marginTop: 4 }}
                      >
                        가입이 완료되었어요.
                      </Inter700Text>
                      <Inter700Text style={{ fontSize: 18, color: '#000000' }}>
                        이제 암정보 가이드를 설정해보세요.
                      </Inter700Text>
                      <View style={viewStyles.rowAiCenter}>
                        <TouchableOpacity
                          style={[
                            viewStyles.rowAiCenterJcCenter,
                            styles.applyButton,
                          ]}
                          onPress={() => {
                            navigate('ApplyCareTrackScreen');
                          }}
                        >
                          <Inter700Text
                            style={{ fontSize: 18, color: '#ED7101' }}
                          >
                            암정보 가이드 설정하기
                          </Inter700Text>
                          <IC_ARROW_RIGHT />
                        </TouchableOpacity>
                        <IC_ETC width={90} height={90} />
                        {/*
                        <Image
                          style={{
                            width: 90,
                            height: 90,
                          }}
                          source={require('@/assets/icons/coaching/ic_etc.png')}
                          resizeMode="contain"
                        />
                        */}
                      </View>
                    </View>
                  </View>
                </LinearGradient>
                <View style={[styles.searchSection]}>
                  <TouchableOpacity
                    onPress={() => navigate('SearchContentsScreen')}
                    style={[styles.searchView, viewStyles.rowAiCenterJcBetween]}
                  >
                    <Inter400Text
                      style={{
                        flex: 1,
                        color: '#B6BDC3',
                        fontSize: 18,
                        fontFamily: FONTS.Inter.Regular,
                      }}
                    >
                      암 정보를 직접 찾아보세요.
                    </Inter400Text>
                    <View style={viewStyles.rowAiCenter}>
                      <View
                        style={[
                          { width: 24, height: 24 },
                          viewStyles.rowAiCenterJcCenter,
                        ]}
                      >
                        <IC_SEARCH />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </Fragment>
            }
          />
        )}
      </Fragment>
      {/** 오늘의 암정보 가이드 & 오늘 할일 - 암정보 가이드 설정 후 **/}
      <Fragment>
        {appliedCareTrack && (
          <ScrollView>
            <FlatList
              data={careTrackList}
              keyExtractor={item => `${item.seq}`}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (!item.removed) {
                      navigate('ContentsDetailScreen', {
                        contentsInfo: item,
                        trackServiceSeq: careTrackAppliedInfo?.seq || null,
                      });
                    } else {
                      if (!showRemovedMsg) {
                        changeState({ showRemovedMsg: true });
                        setTimeout(() => {
                          changeState({ showRemovedMsg: false });
                        }, 2000);
                      }
                    }
                  }}
                  style={{ paddingHorizontal: 20, position: 'relative' }}
                >
                  <ContentCard
                    contentsInfo={item}
                    percent={Number(item.progress)}
                  />
                  {!!item.removed && <View style={styles.removedMaskingView} />}
                </TouchableOpacity>
              )}
              ListHeaderComponent={
                <Fragment>
                  <LinearGradient
                    style={styles.topSection}
                    //colors={['rgba(235, 86, 20, 1)', 'rgba(238, 166, 64, 1)']}
                    //colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)']}
                    colors={[
                      'rgba(245, 245, 220, 0)',
                      'rgba(245, 245, 220, 0)',
                    ]}
                  >
                    <View style={{ marginTop: 20 }}>
                      <Inter400Text
                        style={{
                          color: '#000000',
                          fontSize: 20,
                          marginTop: 8,
                          paddingHorizontal: 16,
                        }}
                      >
                        {'반갑습니다.'}
                      </Inter400Text>
                      <Inter700Text
                        style={{
                          fontSize: 26,
                          color: '#000000',
                          paddingHorizontal: 16,
                        }}
                      >
                        {account.name}님,
                      </Inter700Text>
                      <Fragment>
                        <View style={viewStyles.rowAiEndJcBetween}>
                          <Inter700Text
                            style={{
                              color: '#444444',
                              fontSize: 26,
                              marginTop: 0,
                              paddingHorizontal: 16,
                            }}
                          >
                            {'오늘은 '}
                            <Inter700Text
                              style={{ fontSize: 26, color: '#FEBA00' }}
                            >
                              {getDays(
                                careTrackAppliedInfo === null
                                  ? ''
                                  : dateSplit(
                                      careTrackAppliedInfo.trackCreatedAt,
                                    ),
                              )}
                              일차
                            </Inter700Text>
                            에요!
                          </Inter700Text>
                          <View style={{ marginTop: -20, marginBottom: -8 }}>
                            <IC_ETC width={90} height={90} />
                          </View>
                          {/*
                        <Image
                          style={{
                            width: 90,
                            height: 90,
                          }}
                          source={require('@/assets/icons/coaching/ic_etc.png')}
                          resizeMode="contain"
                        />
                        */}
                        </View>
                        <View style={[styles.todoSection2]}>
                          <View
                            style={[
                              gaugeStyles.gaugeView,
                              { marginVertical: 16 },
                            ]}
                          >
                            <View
                              style={[
                                gaugeStyles.gaugeFilledView,
                                { width: `${doneDayProgress}%` },
                              ]}
                            />
                          </View>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 20,
                              paddingHorizontal: 16,
                            }}
                          >
                            <Inter400Text
                              style={{
                                color: '#000000',
                                fontSize: 18,
                              }}
                            >
                              {'CAMA+와 함께하는 치료여정'}
                            </Inter400Text>
                            <Inter700Text
                              style={{
                                color: '#FE8825',
                                fontSize: 18,
                                paddingLeft: 10,
                              }}
                            >
                              {'D-'}
                              {doneDayCount}
                            </Inter700Text>
                          </View>
                        </View>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          ref={scrollRef}
                          onContentSizeChange={() => {
                            // 여기다가 어떤 경우에 스크롤을 하면 될지에 대한 조건문을 추가하면 된다.
                            scrollRef.current.scrollTo({
                              x:
                                currDayCnt > 3
                                  ? 70 * (currDayCnt - 3) +
                                    10 * (currDayCnt - 3)
                                  : 0, // 한칸넓이 * (일차-1) + 간격 * (일차-1)
                              y: 0,
                              animated: true,
                            });
                          }}
                        >
                          <View style={styles.careTrackWeekdayLineView} />
                          <View
                            style={[
                              viewStyles.rowAiEndJcBetween,
                              { marginTop: 10, paddingLeft: 10 },
                            ]}
                          >
                            {careTrackCheckDays.map((d, index) => (
                              <TouchableOpacity
                                key={d.date}
                                onPress={() =>
                                  onChangeTargetDay(d.days, d.date)
                                }
                                style={[
                                  styles.careTrackWeekdayView,
                                  viewStyles.columnAiCenterJcCenter,
                                  targetDays === d.days && {
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#000066',
                                  },
                                  d.days === daySize && {
                                    backgroundColor: '#FE8825',
                                    borderColor: '##FE8825',
                                  },
                                ]}
                              >
                                <Inter700Text
                                  style={[
                                    {
                                      fontSize: 12,
                                      color: '#999999',
                                      lineHeight: 20,
                                    },
                                    targetDays === d.days && {
                                      color: '#000000',
                                    },
                                    d.days === daySize && {
                                      color: '#FFFFFF',
                                    },
                                  ]}
                                >
                                  {dayStr(d, index)}
                                </Inter700Text>
                                <Inter700Text
                                  style={[
                                    {
                                      fontSize: 20,
                                      color: '#999999',
                                      lineHeight: 20,
                                      marginTop: 10,
                                    },
                                    targetDays === d.days && {
                                      color: '#000000',
                                    },
                                    d.days === daySize && {
                                      color: '#FFFFFF',
                                    },
                                  ]}
                                >
                                  {d.days}
                                </Inter700Text>
                                {d.isCompleted && (
                                  <View
                                    style={[
                                      styles.completedMaskView,
                                      viewStyles.rowAiCenterJcCenter,
                                    ]}
                                  >
                                    <IC_COMPLETED_CHECK_MARK />
                                  </View>
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        </ScrollView>
                      </Fragment>
                    </View>
                  </LinearGradient>
                  {/*
                <View style={[styles.searchSection]}>
                  <TouchableOpacity
                    onPress={() => navigate('SearchContentsScreen')}
                    style={[styles.searchView, viewStyles.rowAiCenterJcBetween]}
                  >
                    <Inter400Text
                      style={{
                        flex: 1,
                        color: '#B6BDC3',
                        fontSize: 18,
                        fontFamily: FONTS.Inter.Regular,
                      }}
                    >
                      암 정보를 직접 찾아보세요.
                    </Inter400Text>
                    <View style={viewStyles.rowAiCenter}>
                      <View
                        style={[
                          { width: 24, height: 24 },
                          viewStyles.rowAiCenterJcCenter,
                        ]}
                      >
                        <IC_SEARCH />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.todoSection]}>
                  <View style={viewStyles.rowAiEndJcBetween}>
                    <Inter700Text
                      style={{ fontSize: 24, color: '#000', width: 160 }}
                    >
                      오늘 할일을 달성해보세요!
                    </Inter700Text>
                    <View>
                      <Inter400Text
                        style={{ fontSize: 16, textAlign: 'right' }}
                      >
                        진행도
                      </Inter400Text>
                      <Inter700Text
                        style={{
                          fontSize: 24,
                          color: '#ED7101',
                          textAlign: 'right',
                        }}
                      >
                        {doneCount}
                        <Inter400Text style={{ fontSize: 20, color: '#000' }}>
                          /{scheduleList.length}
                        </Inter400Text>
                      </Inter700Text>
                    </View>
                  </View>
                  <View style={[gaugeStyles.gaugeView, { marginVertical: 16 }]}>
                    <View
                      style={[
                        gaugeStyles.gaugeFilledView,
                        { width: `${doneProgress}%` },
                      ]}
                    />
                  </View>
                </View>
                    */}
                  <View style={styles.sectionDivider} />
                  <View style={[viewStyles.rowAiStart, styles.articleSection]}>
                    <Inter700Text
                      style={{
                        fontSize: 20,
                        color: '#444444',
                      }}
                    >
                      일정관리
                    </Inter700Text>
                    <Inter400Text
                      style={{
                        fontSize: 18,
                        color: '#BBBBBB',
                        marginRight: 4,
                        marginLeft: 2,
                        marginTop: 2,
                      }}
                    >
                      {'(' +
                        Number(targetDate.substring(5, 7)) +
                        '/' +
                        Number(targetDate.substring(8, 10)) +
                        ')'}
                    </Inter400Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.scheduleCardSection}
                  >
                    <View style={{ width: 16 }} />
                    {scheduleList.map(d => (
                      <ScheduleCard
                        key={d.batchSeq}
                        disabled={isDisabledSchedule(today, targetDate)}
                        isCompleted={d.done}
                        title={scheduleLabel(d.scheduleType)}
                        time={d.time}
                        desc={d.memo}
                        scheduleType={d.scheduleType}
                        onPress={() =>
                          d.done === true
                            ? checkUnDoneSchedule(d)
                            : checkScheduleDone(d)
                        }
                      />
                    ))}
                    {scheduleList.length > 0 && (
                      <View
                        style={[
                          viewStyles.rowAiCenterJcCenter,
                          borderStyles.basicBorder,
                          styles.wrap,
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}
                        >
                          <Inter400Text
                            style={{
                              fontSize: 16,
                              color: '#ED7101',
                              marginRight: 2,
                              marginLeft: 2,
                            }}
                          >
                            {targetDate.substring(0, 4) +
                              '년 ' +
                              Number(targetDate.substring(5, 7)) +
                              '월 ' +
                              Number(targetDate.substring(8, 10)) +
                              '일'}
                          </Inter400Text>

                          <TouchableOpacity
                            onPress={() =>
                              navigate('AddScheduleScreen', {
                                paramTargetDate: targetDate,
                              })
                            }
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 4,
                                marginLeft: 10,
                              }}
                            >
                              {Platform.OS === 'ios' && (
                                <View style={{ margin: 0 }}>
                                  <IC_ADD_MARK width={20} height={20} />
                                </View>
                              )}
                              {Platform.OS !== 'ios' && (
                                <View style={{ margin: 4 }}>
                                  <IC_ADD_MARK width={20} height={20} />
                                </View>
                              )}
                              <Inter700Text
                                style={{
                                  color: '#8C8C8C',
                                  fontSize: 18,
                                }}
                              >
                                일정등록
                              </Inter700Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </ScrollView>
                  {scheduleList.length === 0 && (
                    <View
                      style={[
                        viewStyles.rowAiCenterJcCenter,
                        borderStyles.basicBorder,
                        styles.emptyCardView,
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <Inter400Text
                          style={{
                            fontSize: 18,
                            color: '#ED7101',
                            marginRight: 4,
                            marginLeft: 26,
                          }}
                        >
                          {targetDate.substring(0, 4) +
                            '년 ' +
                            Number(targetDate.substring(5, 7)) +
                            '월 ' +
                            Number(targetDate.substring(8, 10)) +
                            '일'}
                        </Inter400Text>
                        <Inter400Text style={{ fontSize: 18, color: '#000' }}>
                          등록된 일정이 없습니다.
                        </Inter400Text>

                        <TouchableOpacity
                          onPress={() =>
                            navigate('AddScheduleScreen', {
                              paramTargetDate: targetDate,
                            })
                          }
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 4,
                              marginLeft: 26,
                            }}
                          >
                            {Platform.OS === 'ios' && (
                              <View style={{ margin: 0 }}>
                                <IC_ADD_MARK width={20} height={20} />
                              </View>
                            )}
                            {Platform.OS !== 'ios' && (
                              <View style={{ margin: 4 }}>
                                <IC_ADD_MARK width={20} height={20} />
                              </View>
                            )}
                            <Inter700Text
                              style={{
                                color: '#8C8C8C',
                                fontSize: 18,
                              }}
                            >
                              일정등록
                            </Inter700Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  <View style={[styles.sectionDivider, { marginTop: 12 }]} />
                  <View style={[styles.searchSection2]}>
                    <TouchableOpacity
                      onPress={() => navigate('SearchContentsScreen')}
                      style={[
                        styles.searchView,
                        viewStyles.rowAiCenterJcBetween,
                      ]}
                    >
                      <Inter400Text
                        style={{
                          flex: 1,
                          color: '#B6BDC3',
                          fontSize: 18,
                          fontFamily: FONTS.Inter.Regular,
                        }}
                      >
                        암 정보를 직접 찾아보세요.
                      </Inter400Text>
                      <View style={viewStyles.rowAiCenter}>
                        <View
                          style={[
                            { width: 24, height: 24 },
                            viewStyles.rowAiCenterJcCenter,
                          ]}
                        >
                          <IC_SEARCH />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.articleSection]}>
                    <View
                      style={[
                        viewStyles.rowAiEndJcBetween,
                        { marginBottom: 8, marginTop: 2 },
                      ]}
                    >
                      <Inter700Text style={{ fontSize: 20, color: '#000' }}>
                        오늘의 암정보에요.
                      </Inter700Text>
                      <View style={[viewStyles.rowAiCenter]}>
                        <Inter400Text
                          style={{ fontSize: 16, textAlign: 'right' }}
                        >
                          진행도
                        </Inter400Text>
                        <Inter700Text
                          style={{
                            fontSize: 24,
                            color: '#ED7101',
                            paddingLeft: 4,
                          }}
                        >
                          {contentProgress}%
                        </Inter700Text>
                      </View>
                    </View>
                  </View>
                </Fragment>
              }
            />
            <Fragment>
              <View style={[styles.sectionDivider, { marginTop: 12 }]} />
              <View style={[styles.articleSection]}>
                <Inter700Text
                  style={{
                    fontSize: 20,
                    color: '#444444',
                    marginTop: 2,
                  }}
                >
                  건강코칭
                </Inter700Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scheduleCardSection}
              >
                <View style={{ width: 16 }} />
                {coachingProgressList.map(d => (
                  <CoachingCard
                    key={d.categoryCd}
                    categoryCd={d.categoryCd}
                    categoryNm={d.categoryNm}
                    progress={d.progress}
                    onPress={() => moveCategory(d.categoryCd)}
                  />
                ))}
              </ScrollView>
            </Fragment>
            <Fragment>
              <View style={[{ marginTop: 12 }]} />
            </Fragment>
          </ScrollView>
        )}
      </Fragment>
      {/** 서비스 신청 취소 & 암정보 가이드 여정 신청 모달 **/}
      <ConfirmModal
        showModal={showConfirmModal}
        cancelLabel={confirmType === 'CANCEL_APPLYING' ? '예' : '아니오'}
        doneLabel={confirmType === 'CANCEL_APPLYING' ? '아니오' : '예'}
        onPressDone={() => {
          if (confirmType === 'CANCEL_APPLYING') {
            changeState({ showConfirmModal: false });
          }
          if (confirmType === 'APPLY_CARE_TRACK') {
            onApplyCareTrack();
          }
        }}
        onPressCancel={() => {
          if (confirmType === 'CANCEL_APPLYING') {
            onCancelService();
          }
          if (confirmType === 'APPLY_CARE_TRACK') {
            changeState({ showConfirmModal: false });
          }
        }}
      >
        {confirmType === 'CANCEL_APPLYING' && (
          <Inter400Text style={modalStyles.msgLabel}>
            승인신청을 취소하면 다시 승인을 신청해야 합니다. 정말 승인신청을
            취소하시겠습니까?
          </Inter400Text>
        )}
        {confirmType === 'APPLY_CARE_TRACK' && (
          <Inter400Text style={modalStyles.msgLabel}>
            암정보 가이드 여정을 신청하면 병환에 따른 암정보 가이드 여정
            서비스를 이용하실 수 있습니다. 암정보 가이드 여정을
            신청하시겠습니까?
          </Inter400Text>
        )}
      </ConfirmModal>
      {loading && <LoadingView />}
      {showRemovedMsg && (
        <View style={[styles.removedMsgView, viewStyles.rowAiCenterJcCenter]}>
          <Inter400Text style={{ fontSize: 16, color: '#FFF' }}>
            의료진의 판단으로 삭제된 치료정보입니다.
          </Inter400Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeMainScreen;

const styles = StyleSheet.create({
  topSection: {
    paddingBottom: 20,
  },
  applyButton: {
    backgroundColor: '#FFF',
    width: 192,
    height: 34,
    marginTop: 16,
    borderRadius: 26,
  },
  searchSection: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
    padding: 16,
    backgroundColor: '#FFF',
  },
  searchSection2: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    padding: 0,
    backgroundColor: '#FFF',
  },
  searchView: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 42,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  todoSection: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: '#FFF',
  },
  todoSection2: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -4,
    paddingHorizontal: 16,
    paddingTop: 2,
    backgroundColor: '#FFF',
    height: 30,
  },
  scheduleCardSection: {
    marginTop: 8,
  },
  articleSection: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  careTrackWeekdayLineView: {
    position: 'absolute',
    top: 44,
    left: 0,
    width: '100%',
    height: 1,
    backgroundColor: '#FFF',
  },
  careTrackWeekdayView: {
    width: 70,
    height: 70,
    borderRadius: 16,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: '#EAEAEA',
    marginRight: 10,
  },
  completedMaskView: {
    position: 'absolute',
    top: -1,
    left: -1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  removedMsgView: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 56,
    borderRadius: 8,
    backgroundColor: `rgba(0, 0, 0, 0.80)`,
  },
  removedMaskingView: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    bottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  emptyWrap: {
    width: 170,
    height: 130,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginRight: 8,
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
  sectionDivider: {
    width: '100%',
    height: 8,
    backgroundColor: '#EFEFEF',
  },
  emptyCardView: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    backgroundColor: '#FFF',
    height: 132,
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  wrap: {
    width: 170,
    height: 160,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
});

// 1E71C0
