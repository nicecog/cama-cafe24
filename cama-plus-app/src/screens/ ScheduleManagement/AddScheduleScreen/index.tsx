import React, { useState, Fragment, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import dayjs from 'dayjs';

/** Types **/
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';
import { AmPmType, WeekDayType, ScheduleType } from '@/constants/enums';
import { ScheduleDto } from '@/services/apis/scheduleManager/request';
import { AccountDiseaseInfo } from '@/services/apis/AccountDisease/response';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';
import SectionTitle from '@/screens/ ScheduleManagement/AddScheduleScreen/SectionTitle';
import AmPmButton from '@/screens/ ScheduleManagement/AddScheduleScreen/AmPmButton';
import WeekDayButton from '@/screens/ ScheduleManagement/AddScheduleScreen/WeekDayButton';
import SelectedCheckButton from '@/screens/ ScheduleManagement/AddScheduleScreen/SelectedCheckButton';
import RectRoundButton from '@/components/Buttons/RectRoundButton';
import CustomToggle from '@/components/Toggles/CustomToggle';
import CalendarHeader from '@/components/Calendar/CalendarHeader';
import CalendarView from '@/components/Calendar/CalendarView';
import BasicConfirmModal2 from '@/components/Modals/BasicConfirmModal2';
import BasicPickerItem from '@/components/items/BasicPickerItem';

/** Hooks **/
import { useAccountHospitalValue } from '@/hooks/recoil/useAccountHospitalRecoilHook';

/** Services **/
import scheduleManagerApi from '@/services/apis/scheduleManager';

/** Styles **/
import FONTS from '@/constants/fonts';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';

/** Helpers **/
import { showAlertMessage } from '@/utils/alertMessage';
import {
  amPmLabel,
  weekDayLabel,
  scheduleLabel,
} from '@/constants/enumHelpers';
import { timeParser } from '@/utils/numbers';
import { WEEKDAY } from '@/utils/dayjs';
import { hourItems, minuteItems } from '@/constants/values';

/** Assets **/
import IC_ARROW_UP from '@/assets/icons/calendars/ic_arrow_up.svg';
import IC_ARROW_DOWN from '@/assets/icons/calendars/ic_arrow_down.svg';
import IC_CHECK_ACTIVE from '@/assets/icons/buttons/ic_check_active.svg';
import IC_CHECK_EMPTY from '@/assets/icons/buttons/ic_check_empty.svg';

interface PageState {
  amPmType: AmPmType;
  weekDays: WeekDayType[];
  memoText: string;
  scheduleType: ScheduleType | null;
  diseaseType: AccountDiseaseInfo | null;
  pushAgree: boolean;
  repeat: boolean;
  repeatDay: boolean;
  startYearMonth: string;
  startTargetDay: string;
  endYearMonth: string;
  endTargetDay: string;
  showStartCalendar: boolean;
  showEndCalendar: boolean;
  showPicker: boolean;
  selectedHour: string;
  selectedMin: string;
  targetHour: string;
  targetMin: string;
  diseaseList: AccountDiseaseInfo[];
}

export const AMPM: AmPmType[] = ['AM', 'PM'];
export const WEEK_DAY_LIST: WeekDayType[] = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
];
export const SCHEDULE_LIST: ScheduleType[] = ['MEDICINE', 'HOSPITAL', 'ETC'];

const AddScheduleScreen: React.FC<
  MainNavigationScreenProps<'AddScheduleScreen'>
> = ({
  navigation: { goBack },
  route: {
    params: { paramTargetDate },
  },
}) => {
  //console.log(' paramTargetDate => ' + paramTargetDate);
  const accountHospital = useAccountHospitalValue();
  const [state, setState] = useState<PageState>({
    amPmType: 'AM',
    weekDays: [],
    memoText: '',
    scheduleType: null,
    diseaseType: null,
    pushAgree: true,
    repeat: false,
    repeatDay: false,
    startYearMonth:
      paramTargetDate === ''
        ? dayjs().format('YYYY-MM')
        : paramTargetDate.substring(0, 7),
    startTargetDay:
      paramTargetDate === ''
        ? dayjs().format('DD')
        : paramTargetDate.substring(8, 10),
    endYearMonth:
      paramTargetDate === ''
        ? dayjs().format('YYYY-MM')
        : paramTargetDate.substring(0, 7),
    endTargetDay:
      paramTargetDate === ''
        ? dayjs().format('DD')
        : paramTargetDate.substring(8, 10),
    showStartCalendar: false,
    showEndCalendar: false,
    showPicker: false,
    selectedHour: '',
    selectedMin: '',
    targetHour: '8',
    targetMin: '00',
    diseaseList: [],
  });
  // const [time, setTime] = React.useState(asPickerFormat(new Date()));

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const onAddSchedule = () => {
    const {
      diseaseType,
      scheduleType,
      startYearMonth,
      startTargetDay,
      endYearMonth,
      endTargetDay,
      repeat,
      repeatDay,
      pushAgree,
      memoText,
      amPmType,
      targetHour,
      targetMin,
      weekDays,
    } = state;

    const addHour = amPmType === 'AM' ? 0 : 12;
    const hour = timeParser(Number(targetHour) + addHour);

    // if (diseaseType  === null) {
    //   showAlertMessage({
    //     message: '질환을 알려주세요.'
    //   });
    //   return;
    // };

    if (scheduleType === null) {
      showAlertMessage({
        message: '일정 종류를 알려주세요.',
      });
      return;
    }

    if (repeat && weekDays.length === 0) {
      showAlertMessage({
        message: '반복 주기를 알려주세요.',
      });
      return;
    }

    if (memoText.length > 30) {
      showAlertMessage({
        message: '메모는 30자 이내로 작성 가능합니다.',
      });
      return;
    }

    // if (scheduleName  === '') {
    //   showAlertMessage({
    //     message: '일정 이름을 입력해주세요.'
    //   });
    //   return;
    // };

    // const scheduleName = `${diseaseType.diseaseName}_${scheduleLabel(scheduleType)}`

    const dto: ScheduleDto = {
      alarm: pushAgree,
      days: weekDays.map(d => WEEK_DAY_LIST.indexOf(d) + 1), // number[],
      // diseaseSeq: [diseaseType.diseaseSeq], // number[],
      endDate: repeat
        ? `${timeParser(endYearMonth)}-${timeParser(endTargetDay)}`
        : `${timeParser(startYearMonth)}-${timeParser(startTargetDay)}`,
      // endTime: '', // string;
      repeat,
      memo: memoText,
      scheduleName: '',
      scheduleType,
      startDate: `${timeParser(startYearMonth)}-${timeParser(startTargetDay)}`,
      // startTime: '', // string;
      time: `${hour}:${targetMin}:00`,
    };

    // console.log(JSON.stringify(dto));

    scheduleManagerApi
      .addSchedule(dto)
      .then(res => {
        if (res) {
          showAlertMessage({
            message: '등록되었습니다.',
            onPress: () => goBack(),
          });
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const onToggleWeekDay = (weekDayType: WeekDayType) => {
    const { weekDays } = state;
    if (weekDays.includes(weekDayType)) {
      const filteredWeekDays = weekDays.filter(d => d !== weekDayType);
      changeState({ weekDays: filteredWeekDays });
    } else {
      changeState({ weekDays: [...weekDays, weekDayType] });
    }
  };

  const initData = () => {
    // accountDiseaseApi
    //   .fetchAccountDiseaseList(accountHospital.hospitalSeq)
    //   .then(res => {
    //     changeState({
    //       diseaseList: res,
    //       diseaseType: res.length === 1 ? res[0] : null,
    //     });
    //   })
    //   .catch(err => {
    //     showAlertMessage({
    //       message: err,
    //       onPress: () => goBack(),
    //     });
    //   });
  };

  useEffect(() => {
    initData();
  }, []);

  const {
    amPmType,
    weekDays,
    memoText,
    scheduleType,
    pushAgree,
    repeat,
    repeatDay,
    startYearMonth,
    startTargetDay,
    endYearMonth,
    endTargetDay,
    showStartCalendar,
    showEndCalendar,
    showPicker,
    selectedHour,
    selectedMin,
    targetHour,
    targetMin,
  } = state;

  const [startYear, startMonth] = startYearMonth.split('-');
  const [endYear, endMonth] = endYearMonth.split('-');
  const endRepeatYear = endYear + 1;
  const startTargetWeekDay = dayjs(`${startYearMonth}-${startTargetDay}`).get(
    'days',
  );
  const endTargetWeekDay = dayjs(`${endYearMonth}-${endTargetDay}`).get('days');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader title="일정등록" />
      <View style={{ flex: 1 }}>
        <View style={[styles.sectionView, borderStyles.borderB]}>
          <View style={[viewStyles.rowAiStart]}>
            <View style={{ marginTop: 5, marginRight: 30 }}>
              <Inter700Text style={{ fontSize: 17, color: '#000', width: 70 }}>
                일정종류
              </Inter700Text>
            </View>
            {SCHEDULE_LIST.map(d => (
              <SelectedCheckButton
                key={d}
                label={scheduleLabel(d)}
                selected={scheduleType === d}
                onSelect={() => changeState({ scheduleType: d })}
              />
            ))}
          </View>
          <View style={[styles.sectionDivider, { marginTop: 2 }]} />
        </View>
      </View>
      <View style={{ flex: 7 }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.sectionView, { marginBottom: -14 }]}>
            <View style={[viewStyles.rowAiStart]}>
              <View style={{ marginRight: 30, marginTop: 10 }}>
                <Inter700Text
                  style={{ fontSize: 17, color: '#000', width: 70 }}
                >
                  시작일
                </Inter700Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  changeState({ showStartCalendar: !showStartCalendar })
                }
                style={[styles.btnView, viewStyles.rowAiCenter]}
              >
                <Inter700Text
                  style={{ fontSize: 17, color: '#ED7101', marginRight: 4 }}
                >
                  {startYear}년 {startMonth}월 {startTargetDay}일 (
                  {WEEKDAY[startTargetWeekDay]})
                </Inter700Text>
                {showStartCalendar ? <IC_ARROW_UP /> : <IC_ARROW_DOWN />}
              </TouchableOpacity>
            </View>
          </View>
          {showStartCalendar && (
            <Fragment>
              <CalendarHeader
                targetMonth={Number(startMonth)}
                targetType={'A'}
                onPressPrev={() => {
                  changeState({
                    startYearMonth: dayjs(startYearMonth)
                      .add(-1, 'month')
                      .format('YYYY-MM'),
                    startTargetDay: '1',
                  });
                }}
                onPressNext={() => {
                  changeState({
                    startYearMonth: dayjs(startYearMonth)
                      .add(1, 'month')
                      .format('YYYY-MM'),
                    startTargetDay: '1',
                  });
                }}
              />
              <CalendarView
                yearMonth={startYearMonth}
                targetDay={startTargetDay}
                onSelectDate={day => changeState({ startTargetDay: day })}
              />
            </Fragment>
          )}

          <View style={[styles.sectionViewB]}>
            <View style={[viewStyles.rowAiStart]}>
              <View style={{ marginRight: 30, marginTop: 10 }}>
                <Inter700Text
                  style={{ fontSize: 17, color: '#000', width: 70 }}
                >
                  시간
                </Inter700Text>
              </View>

              {AMPM.map(d => (
                <AmPmButton
                  key={d}
                  label={amPmLabel(d)}
                  selected={amPmType === d}
                  onSelect={() => changeState({ amPmType: d })}
                />
              ))}
              <TouchableOpacity
                onPress={() => changeState({ showPicker: true })}
                style={[styles.btnViewB, viewStyles.rowAiCenter]}
              >
                <View style={viewStyles.columnAiCenter}>
                  {/*<Inter400Text style={{ fontSize: 40, color: '#7E7E7E' }}>7</Inter400Text>*/}
                  <Inter700Text style={{ fontSize: 17, color: '#FE8825' }}>
                    {targetHour}
                  </Inter700Text>
                  {/*<Inter400Text style={{ fontSize: 40, color: '#7E7E7E' }}>9</Inter400Text>*/}
                </View>
                <Inter700Text
                  style={{
                    fontSize: 17,
                    color: '#FE8825',
                    marginHorizontal: 4,
                  }}
                >
                  :
                </Inter700Text>
                <View style={viewStyles.columnAiCenter}>
                  {/*<Inter400Text style={{ fontSize: 40, color: '#7E7E7E' }}>59</Inter400Text>*/}
                  <Inter700Text style={{ fontSize: 17, color: '#FE8825' }}>
                    {targetMin}
                  </Inter700Text>
                  {/*<Inter400Text style={{ fontSize: 40, color: '#7E7E7E' }}>01</Inter400Text>*/}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.sectionView,
              borderStyles.borderB,
              viewStyles.rowAiCenterJcBetween,
            ]}
          >
            <View style={viewStyles.rowAiCenter}>
              {/*
            <View style={{ marginTop: 4, marginRight: 14 }}>
              <CustomToggle
                isOn={repeat}
                onToggle={() => {
                  changeState({
                    repeat: !repeat,
                    showEndCalendar: false,
                  });
                }}
              />
            </View>
             */}

              <View style={{ marginTop: 0, marginRight: 14 }}>
                <TouchableOpacity
                  onPress={() => {
                    changeState({
                      repeat: !repeat,
                      showEndCalendar: false,
                    });
                  }}
                >
                  {repeat ? (
                    <IC_CHECK_ACTIVE width={35} height={35} />
                  ) : (
                    <IC_CHECK_EMPTY width={35} height={35} />
                  )}
                </TouchableOpacity>
              </View>
              <Inter700Text
                style={{
                  fontSize: 17,
                  color: '#444444',
                  marginRight: 10,
                }}
              >
                반복
              </Inter700Text>
            </View>
          </View>

          {repeat && (
            <Fragment>
              <View
                style={[
                  styles.sectionView,
                  borderStyles.borderB,
                  viewStyles.rowAiStart,
                ]}
              >
                <View style={{ marginTop: 0, marginRight: 14 }}>
                  <TouchableOpacity
                    onPress={() => {
                      const { weekDays } = state;
                      //console.log('weekDays ' + weekDays);
                      changeState({ repeatDay: !repeatDay });
                      if (!repeatDay) {
                        changeState({
                          weekDays: [
                            'MON',
                            'TUE',
                            'WED',
                            'THU',
                            'FRI',
                            'SAT',
                            'SUN',
                          ],
                        });
                        changeState({
                          endYearMonth: dayjs(endYearMonth)
                            .add(6, 'month')
                            .format('YYYY-MM'),
                        });
                      } else {
                        changeState({
                          weekDays: [],
                        });
                        changeState({
                          endYearMonth: dayjs(endYearMonth)
                            .add(-6, 'month')
                            .format('YYYY-MM'),
                        });
                      }
                    }}
                  >
                    {repeatDay ? (
                      <IC_CHECK_ACTIVE width={35} height={35} />
                    ) : (
                      <IC_CHECK_EMPTY width={35} height={35} />
                    )}
                  </TouchableOpacity>
                </View>

                <Inter400Text
                  style={{
                    fontSize: 17,
                    color: '#444444',
                    marginRight: 10,
                    marginTop: 4,
                  }}
                >
                  매일반복
                </Inter400Text>
              </View>
              <View style={[styles.sectionView, borderStyles.borderB]}>
                <View
                  style={[viewStyles.rowAiCenterJcBetween, { marginTop: 0 }]}
                >
                  {WEEK_DAY_LIST.map(d => (
                    <WeekDayButton
                      key={d}
                      label={weekDayLabel(d)}
                      selected={weekDays.includes(d)}
                      onSelect={() => onToggleWeekDay(d)}
                    />
                  ))}
                </View>
              </View>

              <View style={[styles.sectionView]}>
                <View style={[viewStyles.rowAiStart]}>
                  <View style={{ marginRight: 30, marginTop: 10 }}>
                    <Inter700Text
                      style={{ fontSize: 17, color: '#000', width: 70 }}
                    >
                      종료일
                    </Inter700Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      changeState({ showEndCalendar: !showEndCalendar })
                    }
                    style={[styles.btnView, viewStyles.rowAiCenter]}
                  >
                    <Inter700Text
                      style={{ fontSize: 17, color: '#ED7101', marginRight: 4 }}
                    >
                      {endYear}년 {endMonth}월 {endTargetDay}일 (
                      {WEEKDAY[endTargetWeekDay]})
                    </Inter700Text>
                    {showEndCalendar ? <IC_ARROW_UP /> : <IC_ARROW_DOWN />}
                  </TouchableOpacity>
                </View>
              </View>

              {showEndCalendar && (
                <Fragment>
                  <CalendarHeader
                    targetMonth={Number(endMonth)}
                    targetType={'A'}
                    onPressPrev={() => {
                      changeState({
                        endYearMonth: dayjs(endYearMonth)
                          .add(-1, 'month')
                          .format('YYYY-MM'),
                        endTargetDay: '1',
                      });
                    }}
                    onPressNext={() => {
                      changeState({
                        endYearMonth: dayjs(endYearMonth)
                          .add(1, 'month')
                          .format('YYYY-MM'),
                        endTargetDay: '1',
                      });
                    }}
                  />
                  <CalendarView
                    yearMonth={endYearMonth}
                    targetDay={endTargetDay}
                    onSelectDate={day => changeState({ endTargetDay: day })}
                  />
                </Fragment>
              )}
            </Fragment>
          )}

          <View style={styles.sectionDivider} />

          <View style={[styles.sectionView, borderStyles.borderB]}>
            <SectionTitle boldText={'메모'} etcText={''} />
            <TextInput
              value={memoText}
              allowFontScaling={false}
              placeholder={'    내용을 입력해세요. (30자)'}
              onChangeText={text => {
                if (text.length <= 30) {
                  changeState({ memoText: text });
                }
              }}
              placeholderTextColor={'#B6BDC3'}
              style={{
                color: '#000',
                backgroundColor: '#F9F9F9',
                fontSize: 17,
                fontFamily: FONTS.Inter.Bold,
                marginTop: 10,
              }}
            />
          </View>
          <View style={styles.sectionDivider} />

          <View
            style={[
              styles.sectionView,
              borderStyles.borderB,
              viewStyles.rowAiStart,
            ]}
          >
            {/*
          <View style={{ marginTop: 4, marginRight: 14 }}>
            <CustomToggle
              isOn={pushAgree}
              onToggle={() => changeState({ pushAgree: !pushAgree })}
            />
          </View>
          */}

            <View style={{ marginTop: 0, marginRight: 14 }}>
              <TouchableOpacity
                onPress={() => {
                  changeState({ pushAgree: !pushAgree });
                }}
              >
                {pushAgree ? (
                  <IC_CHECK_ACTIVE width={35} height={35} />
                ) : (
                  <IC_CHECK_EMPTY width={35} height={35} />
                )}
              </TouchableOpacity>
            </View>

            <Inter400Text
              style={{
                fontSize: 17,
                color: '#444444',
                marginRight: 10,
                marginTop: 4,
              }}
            >
              알림
            </Inter400Text>
          </View>
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.buttonSection2}>
          <RectRoundButton label={'일정 등록'} onPress={onAddSchedule} />
        </View>
      </View>

      <BasicConfirmModal2
        showPicker={showPicker}
        title={'일정 시간 선택하기'}
        itemCount={12}
        leftLabel={'취소'}
        rightLabel={'적용'}
        onCloseModal={() => changeState({ showPicker: false })}
        onPressLeft={() => changeState({ showPicker: false })}
        onPressRight={() => {
          if (selectedHour === '') {
            showAlertMessage({
              message: '시간(시)을 선택해주세요.',
            });
            return;
          }

          // if (selectedMin === '') {
          //   showAlertMessage({
          //     message: '시간(분)을 선택해주세요.'
          //   })
          //   return;
          // }

          const resultMin = selectedMin === '' ? '00' : selectedMin;

          changeState({
            targetHour: selectedHour,
            targetMin: resultMin,
            // selectedHour: '',
            selectedMin: resultMin,
            showPicker: false,
          });
        }}
      >
        <View style={[viewStyles.rowAiCenter, { flex: 1 }]}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {hourItems.map(d => (
              <BasicPickerItem
                key={d}
                label={`${d}시`}
                selected={selectedHour === d}
                onPress={() => changeState({ selectedHour: d })}
              />
            ))}
          </ScrollView>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {minuteItems.map(d => (
              <BasicPickerItem
                key={d}
                label={`${d}분`}
                selected={selectedMin === d}
                onPress={() => changeState({ selectedMin: d })}
              />
            ))}
          </ScrollView>
        </View>
      </BasicConfirmModal2>
    </SafeAreaView>
  );
};

export default AddScheduleScreen;

const styles = StyleSheet.create({
  timePickerView: {
    paddingVertical: 24,
    backgroundColor: '#FFF',
  },
  sectionView: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  sectionViewB: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#FFF',
  },
  sectionDivider: {
    width: '100%',
    height: 8,
    backgroundColor: '#EFEFEF',
  },
  buttonSection: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  buttonSection2: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnView: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F4F4F4',
    borderColor: '#ED7101',
    borderRadius: 18,
    marginRight: 20,
    marginBottom: 4,
  },
  btnViewB: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F4F4F4',
    borderColor: '#ED7101',
    borderRadius: 18,
    marginRight: 20,
    marginBottom: 4,
    marginLeft: 40,
  },
});
