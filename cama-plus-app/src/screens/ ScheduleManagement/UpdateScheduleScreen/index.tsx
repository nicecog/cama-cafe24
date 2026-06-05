import React, { useState, useEffect, Fragment } from 'react';
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
import { AccountDiseaseInfo } from '@/services/apis/AccountDisease/response';
import { ScheduleDto } from '@/services/apis/scheduleManager/request';

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
import BasicPickerItem from '@/components/items/BasicPickerItem';
import BasicConfirmModal2 from '@/components/Modals/BasicConfirmModal2';
import ConfirmModal from '@/components/Modals/ConfirmModal';

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
import {
  AMPM,
  WEEK_DAY_LIST,
  SCHEDULE_LIST,
} from '@/screens/ ScheduleManagement/AddScheduleScreen';
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
  sameSchedule: boolean;
  repeat: boolean;
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
  showRemoveConfirm: boolean;
}

const UpdateScheduleScreen: React.FC<
  MainNavigationScreenProps<'UpdateScheduleScreen'>
> = ({
  navigation: { goBack },
  route: {
    params: { schedule },
  },
}) => {
  const accountHospital = useAccountHospitalValue();
  const [state, setState] = useState<PageState>({
    amPmType: 'AM',
    weekDays: [],
    memoText: '',
    scheduleType: null,
    diseaseType: null,
    pushAgree: true,
    sameSchedule: true,
    repeat: false,
    startYearMonth: dayjs().format('YYYY-MM'),
    startTargetDay: dayjs().format('DD'),
    endYearMonth: dayjs().format('YYYY-MM'),
    endTargetDay: dayjs().format('DD'),
    showStartCalendar: false,
    showEndCalendar: false,
    showPicker: false,
    selectedHour: '',
    selectedMin: '',
    targetHour: '8',
    targetMin: '00',
    diseaseList: [],
    showRemoveConfirm: false,
  });

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
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

  const onDeleteSchedule = () => {
    scheduleManagerApi
      .deleteSchedule(schedule.scheduleSeq)
      .then(res => {
        if (res) {
          goBack();
        }
      })
      .catch(err => {
        showAlertMessage({ message: err });
      });
  };

  const onUpdateSchedule = () => {
    const {
      diseaseType,
      scheduleType,
      startYearMonth,
      startTargetDay,
      endYearMonth,
      endTargetDay,
      repeat,
      pushAgree,
      memoText,
      amPmType,
      targetHour,
      targetMin,
      weekDays,
    } = state;

    const addHour = amPmType === 'AM' ? 0 : 12;
    const hour = timeParser(Number(targetHour) + addHour);

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

    const dto: ScheduleDto = {
      alarm: pushAgree,
      days: weekDays.map(d => WEEK_DAY_LIST.indexOf(d) + 1), // number[],
      endDate: repeat
        ? `${timeParser(endYearMonth)}-${timeParser(endTargetDay)}`
        : `${timeParser(startYearMonth)}-${timeParser(startTargetDay)}`,
      repeat,
      memo: memoText,
      scheduleName: '',
      scheduleType,
      startDate: `${timeParser(startYearMonth)}-${timeParser(startTargetDay)}`,
      time: `${hour}:${targetMin}:00`,
    };

    scheduleManagerApi
      .updateSchedule(schedule.scheduleSeq, dto)
      .then(res => {
        if (res) {
          showAlertMessage({
            message: '수정되었습니다.',
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

  const initData = () => {
    const {
      alarm,
      days,
      diseaseSeq,
      scStartDate,
      scEndDate,
      endDate,
      repeat,
      scheduleName,
      scheduleType,
      startDate,
      time,
    } = schedule;

    const parsedDiseaseSeq = (JSON.parse(diseaseSeq) || []) as number[];
    const parsedDays = (JSON.parse(days) || []) as number[];
    const [eYear, eMonth, eDay] = scEndDate.split('-');
    const [sYear, sMonth, sDay] = scStartDate.split('-');
    const [hour, min] = time.split(':');
    const ampm = Number(hour) >= 12 ? 'PM' : 'AM';
    const targetHour = Number(hour) >= 12 ? Number(hour) - 12 : hour;

    changeState({
      // diseaseList: res,
      amPmType: ampm,
      weekDays: parsedDays.map(d => WEEK_DAY_LIST[d - 1]),
      scheduleType: scheduleType,
      // diseaseType: res.filter(d => parsedDiseaseSeq.includes(d.diseaseSeq))[0] || null,
      pushAgree: alarm,
      repeat: repeat,
      startYearMonth: `${sYear}-${sMonth}`,
      startTargetDay: sDay,
      endYearMonth: `${eYear}-${eMonth}`,
      endTargetDay: eDay,
      showStartCalendar: false,
      showEndCalendar: false,
      selectedHour: `${Number(targetHour)}`,
      selectedMin: min,
      targetHour: `${Number(targetHour)}`,
      targetMin: min,
      memoText: schedule.memo,
    });
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
    sameSchedule,
    repeat,
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
    showRemoveConfirm,
  } = state;

  const [startYear, startMonth] = startYearMonth.split('-');
  const [endYear, endMonth] = endYearMonth.split('-');
  const startTargetWeekDay = dayjs(`${startYearMonth}-${startTargetDay}`).get(
    'days',
  );
  const endTargetWeekDay = dayjs(`${endYearMonth}-${endTargetDay}`).get('days');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader title="일정수정/삭제" />
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

          <View style={styles.sectionDivider} />
          {/*
        <View style={[styles.sectionView, viewStyles.rowAiCenter]}>
          <TouchableOpacity
            onPress={() => changeState({ showRemoveConfirm: true })}
            style={[
              styles.btnView,
              viewStyles.rowAiCenter,
              borderStyles.buttonBorder,
              {
                backgroundColor: '#EAEAEA',
                borderColor: '#EAEAEA',
              },
            ]}
          >
            <Inter400Text style={{ color: '#000', fontSize: 18, width: 100 }}>
              일정 삭제
            </Inter400Text>
          </TouchableOpacity>
        </View>
          */}
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <View style={[viewStyles.rowAiEndJcBetween]}>
          <View
            style={{ paddingHorizontal: 16, paddingVertical: 10, width: 160 }}
          >
            <RectRoundButton
              label={'일정 삭제'}
              onPress={() => changeState({ showRemoveConfirm: true })}
            />
          </View>
          <View
            style={{ paddingHorizontal: 16, paddingVertical: 10, width: 160 }}
          >
            <RectRoundButton label={'일정 수정'} onPress={onUpdateSchedule} />
          </View>
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

          if (selectedMin === '') {
            showAlertMessage({
              message: '시간(분)을 선택해주세요.',
            });
            return;
          }

          changeState({
            targetHour: selectedHour,
            targetMin: selectedMin,
            // selectedHour: '',
            // selectedMin: '',
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
      <ConfirmModal
        showModal={showRemoveConfirm}
        onPressDone={() => onDeleteSchedule()}
        onPressCancel={() => changeState({ showRemoveConfirm: false })}
        doneLabel={'예'}
        cancelLabel={'아니오'}
      >
        <Inter400Text
          style={{
            color: '#ED7101',
            fontSize: 26,
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          일정 삭제
        </Inter400Text>
        <Inter400Text
          style={{
            color: '#000',
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          일정을 전부 삭제하시겠습니까?
        </Inter400Text>
        <Inter400Text
          style={{
            color: '#ED7101',
            fontSize: 22,
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          * 주의사항
        </Inter400Text>
        <Inter400Text
          style={{
            color: '#000',
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          특정 요일 반복 삭제 하려면 {'\n'}해당 요일을{'\n'} 제외하고 수정
          하십시요.
        </Inter400Text>
      </ConfirmModal>
    </SafeAreaView>
  );
};

export default UpdateScheduleScreen;

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
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F4F4F4',
    borderColor: '#ED7101',
    borderRadius: 18,
    marginRight: 20,
    marginBottom: 4,
    marginLeft: 30,
  },
});
