import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import dayjs from 'dayjs';
import { useIsFocused } from '@react-navigation/native';

/** Types **/
import { MainBottomTabNavigationProps } from '@/navigations/MainBottomTabNavigation';
import { ScheduleType } from '@/constants/enums';
import { ScheduleInfo } from '@/services/apis/scheduleManager/response';

/** Components **/
import CalendarHeader from '@/components/Calendar/CalendarHeader';
import CalendarView from '@/components/Calendar/CalendarView';
import ScheduleItem, {
  EmptyScheduleItem,
} from '@/components/items/scheduleItem';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import LogoHeader from '@/components/Headers/LogoHeader';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';

/** Services **/
import scheduleManagerApi from '@/services/apis/scheduleManager';

/** Utils & Helpers **/
import { scheduleLabel } from '@/constants/enumHelpers';
import { timeParser } from '@/utils/numbers';
import { showAlertMessage } from '@/utils/alertMessage';
import { WEEKDAY } from '@/utils/dayjs';

/** Assets **/
import IC_DELETE from '@/assets/icons/schedules/ic_delete.svg';
import IC_EDIT from '@/assets/icons/schedules/ic_edit.svg';
import IC_CHECK_ACTIVE from '@/assets/icons/buttons/ic_check_active.svg';
import IC_CHECK_DISABLE from '@/assets/icons/buttons/ic_check_disable.svg';
import IC_CHECK_EMPTY from '@/assets/icons/buttons/ic_check_empty.svg';

import { SwipeListView } from 'react-native-swipe-list-view';

interface PageState {
  yearMonth: string;
  targetDay: string;
  scheduleType: ScheduleType;
  scheduleList: ScheduleInfo[];
  filteredScheduleList: ScheduleInfo[];
  monthlyList: ScheduleInfo[];
  showRemoveConfirm: boolean;
}

const SCHEDULE_LIST: ScheduleType[] = ['ALL', 'MEDICINE', 'HOSPITAL', 'ETC'];

let scheduleSeq: number = 0;

const ScheduleManagementMainScreen: React.FC<
  MainBottomTabNavigationProps<'HomeMainScreen'>
> = ({ navigation: { navigate } }) => {
  const isFocused = useIsFocused();
  const [state, setState] = useState<PageState>({
    yearMonth: dayjs().format('YYYY-MM'),
    targetDay: dayjs().format('DD'),
    scheduleType: 'ALL',
    scheduleList: [],
    filteredScheduleList: [],
    monthlyList: [],
    showRemoveConfirm: false,
  });
  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const checkScheduleDone = (scheduleInfo: ScheduleInfo) => {
    //console.log(
    //  'checkScheduleDone => ' + JSON.stringify(scheduleInfo, null, 2),
    //);
    scheduleManagerApi
      .checkDoneSchedule(scheduleInfo.batchSeq)
      .then(res => {
        if (res) {
          const targetDate = `${yearMonth}-${timeParser(targetDay)}`;
          fetchData(targetDate);
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
          const targetDate = `${yearMonth}-${timeParser(targetDay)}`;
          fetchData(targetDate);
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const { showRemoveConfirm } = state;

  const onPressPrev = () => {
    const { yearMonth } = state;

    const nextYearMonth = dayjs(yearMonth).add(-1, 'month').format('YYYY-MM');
    const targetDay = '1';

    selectDate(nextYearMonth, targetDay);
  };

  const onPressNext = () => {
    const { yearMonth } = state;

    const nextYearMonth = dayjs(yearMonth).add(1, 'month').format('YYYY-MM');
    const targetDay = '1';

    selectDate(nextYearMonth, targetDay);
  };

  const selectDate = (yearMonth: string, day: string) => {
    const targetDate = `${yearMonth}-${timeParser(day)}`;
    //console.log('targetDate => ' + targetDate);
    fetchData(targetDate);
  };

  const changeScheduleType = (scheduleType: ScheduleType) => {
    const { scheduleList } = state;

    if (scheduleType === 'ALL') {
      changeState({
        scheduleType: scheduleType,
        filteredScheduleList: scheduleList,
      });
    } else {
      const filteredList = scheduleList.filter(
        d => d.scheduleType === scheduleType,
      );
      changeState({
        scheduleType: scheduleType,
        filteredScheduleList: filteredList,
      });
    }
  };

  const fetchData = (targetDate: string) => {
    const { scheduleType } = state;
    const [yyyy, mm, dd] = targetDate.split('-');

    Promise.all([
      scheduleManagerApi.getSchedule(targetDate),
      scheduleManagerApi.getScheduleMonthly(`${yyyy}${mm}${dd}`),
    ])
      .then(([res, monthlyList]) => {
        changeState({
          scheduleList: res,
          filteredScheduleList:
            scheduleType === 'ALL'
              ? res
              : res.filter(d => d.scheduleType === scheduleType),
          yearMonth: `${yyyy}-${mm}`,
          targetDay: dd,
          // scheduleType: 'ALL',
          monthlyList: monthlyList,
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
      const today = dayjs().format('YYYY-MM-DD');
      fetchData(today);
    }
  }, [isFocused]);

  const {
    yearMonth,
    scheduleType,
    targetDay,
    filteredScheduleList,
    monthlyList,
  } = state;
  const [year, month] = yearMonth.split('-');
  const targetWeekDay = dayjs(`${yearMonth}-${targetDay}`).get('days');

  const [text, setText] = useState('Not Pressed');

  const onDeleteSchedule = () => {
    scheduleManagerApi
      .deleteSchedule(scheduleSeq)
      .then(res => {
        if (res) {
          changeState({ showRemoveConfirm: false });
          const today = dayjs().format('YYYY-MM-DD');
          const currDay = year + '-' + month + '-' + targetDay;
          //console.log('currDay =>' + currDay);
          fetchData(currDay);
        }
      })
      .catch(err => {
        showAlertMessage({ message: err });
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View
        style={[
          styles.filterSection,
          viewStyles.rowAiCenterJcCenter,
          borderStyles.borderB,
        ]}
      >
        {SCHEDULE_LIST.map(d => (
          <TouchableOpacity
            key={d}
            onPress={() => changeScheduleType(d)}
            style={[
              styles.filterSelectedView,
              scheduleType === d &&
                scheduleType === 'ALL' && {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#FE8825',
                },
              scheduleType === 'MEDICINE' && {
                backgroundColor: '#FFFFFF',
                borderColor: '#dd5e17',
              },
              scheduleType === 'HOSPITAL' && {
                backgroundColor: '#FFFFFF',
                borderColor: '#6cb77e',
              },
              scheduleType === 'ETC' && {
                backgroundColor: '#FFFFFF',
                borderColor: '#777777',
              },
              scheduleType !== d &&
                d === 'ALL' && {
                  backgroundColor: '#E4E4E4',
                  borderColor: '#EAEAEA',
                },
              scheduleType !== d &&
                d === 'MEDICINE' && {
                  backgroundColor: '#E4E4E4',
                  borderColor: '#EAEAEA',
                },
              scheduleType !== d &&
                d === 'HOSPITAL' && {
                  backgroundColor: '#E4E4E4',
                  borderColor: '#EAEAEA',
                },
              scheduleType !== d &&
                d === 'ETC' && {
                  backgroundColor: '#E4E4E4',
                  borderColor: '#EAEAEA',
                },
            ]}
          >
            {d === 'ALL' && (
              <Inter700Text style={{ color: '#FE8825' }}>
                {scheduleLabel(d)}
              </Inter700Text>
            )}
            {d === 'MEDICINE' && (
              <Inter700Text style={{ color: '#dd5e17' }}>
                {scheduleLabel(d)}
              </Inter700Text>
            )}
            {d === 'HOSPITAL' && (
              <Inter700Text style={{ color: '#6cb77e' }}>
                {scheduleLabel(d)}
              </Inter700Text>
            )}
            {d === 'ETC' && (
              <Inter700Text style={{ color: '#777777' }}>
                {scheduleLabel(d)}
              </Inter700Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ backgroundColor: '#F6F6F6' }}>
        <CalendarHeader
          targetYear={year}
          targetMonth={Number(month)}
          onPressPrev={onPressPrev}
          onPressNext={onPressNext}
          onPressAddSchedule={() =>
            navigate('AddScheduleScreen', {
              paramTargetDate: `${yearMonth}-${targetDay}`,
            })
          }
        />
        <CalendarView
          yearMonth={yearMonth}
          targetDay={targetDay}
          monthlyTargetList={monthlyList.filter(
            d => scheduleType === 'ALL' || d.scheduleType === scheduleType,
          )}
          onSelectDate={day => selectDate(yearMonth, day)}
        />
      </View>
      <View style={styles.scheduleSection}>
        <View style={viewStyles.rowAiCenterJcCenter}>
          <Inter700Text style={{ fontSize: 18, padding: 14, color: '#774F2D' }}>
            {year}년 {Number(month)}월 {Number(targetDay)}일 (
            {WEEKDAY[targetWeekDay]})
          </Inter700Text>
        </View>
        <ScrollView style={{ backgroundColor: '#F6F6F6' }}>
          {filteredScheduleList.map(d => {
            const [hour, min] = d.time.split(':');
            const ampm = Number(hour) >= 12 ? '오후' : '오전';
            return (
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 6 }}>
                  <ScheduleItem
                    key={d.scheduleSeq}
                    ampm={Number(d.time.split(':')[0]) >= 12 ? '오후' : '오전'}
                    time={d.time.split(':')[0] + ':' + d.time.split(':')[1]}
                    title={scheduleLabel(d.scheduleType)}
                    memo={d.memo}
                    done={d.done}
                    onPressUpdate={() =>
                      navigate('UpdateScheduleScreen', {
                        schedule: d,
                      })
                    }
                    onPressDone={() =>
                      d.done === true
                        ? checkUnDoneSchedule(d)
                        : checkScheduleDone(d)
                    }
                  />
                </View>
                <View style={{ flex: 1, paddingLeft: 4, paddingTop: 4 }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate('UpdateScheduleScreen', {
                        schedule: d,
                      })
                    }
                  >
                    <View
                      style={[
                        d.memo !== ''
                          ? styles.swipeHiddenItemL2
                          : styles.swipeHiddenItemL,
                        { backgroundColor: '#FE8825' },
                      ]}
                    >
                      <IC_EDIT width={20} height={20} />
                      <Inter400Text
                        style={{
                          fontSize: 12,
                          color: '#FFFFFF',
                        }}
                      >
                        수정
                      </Inter400Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, paddingLeft: 2, paddingTop: 4 }}>
                  <TouchableOpacity
                    onPress={() => {
                      changeState({ showRemoveConfirm: true });
                      scheduleSeq = d.scheduleSeq;
                    }}
                  >
                    <View
                      style={[
                        d.memo !== ''
                          ? styles.swipeHiddenItemR2
                          : styles.swipeHiddenItemR,
                        { backgroundColor: '#8C8C8C' },
                      ]}
                    >
                      <IC_DELETE width={20} height={20} />
                      <Inter400Text
                        style={{
                          fontSize: 12,
                          color: '#FFFFFF',
                        }}
                      >
                        삭제
                      </Inter400Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
        {filteredScheduleList.length === 0 && <EmptyScheduleItem />}
      </View>
      <ConfirmModal
        showModal={showRemoveConfirm}
        onPressDone={() => onDeleteSchedule()}
        onPressCancel={() => changeState({ showRemoveConfirm: false })}
        doneLabel={'네'}
        cancelLabel={'아니요'}
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
          일정을 정말 삭제할까요?
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
          반복 설정한 일정은 전부{'\n'}삭제 됩니다.{'\n'}
          특정 요일만 반복 삭제 하려면 {'\n'}수정 화면에서 해당 요일을{'\n'}{' '}
          제외 수정 하십시요.
        </Inter400Text>
      </ConfirmModal>
    </SafeAreaView>
  );
};

export default ScheduleManagementMainScreen;

const styles = StyleSheet.create({
  filterSection: {
    padding: 16,
  },
  filterSelectedView: {
    borderRadius: 19,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EAEAEA',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
    marginRight: 4,
  },
  scheduleSection: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#F9F9F9',
  },
  addScheduleBtnView: {
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
  container: {
    flex: 1,
  },
  textContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styledText: {
    color: '#111',
    fontWeight: 'bold',
  },
  swipeListItem: {
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 20,
    backgroundColor: '#eee',
  },
  swipeHiddenItemContainer: {
    flex: 1,
    height: 100,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
  },
  swipeHiddenItemL: {
    width: 42,
    height: 46,
    paddingTop: 2,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  swipeHiddenItemL2: {
    width: 42,
    height: 46,
    paddingTop: 2,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  swipeHiddenItemR: {
    width: 42,
    height: 46,
    paddingTop: 2,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  swipeHiddenItemR2: {
    width: 42,
    height: 46,
    paddingTop: 2,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  swipeHiddenItemText: {
    color: 'red',
    fontSize: 14,
  },
});
