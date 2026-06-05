import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';

/** Assets **/
import IC_ARROW_PREV from '@/assets/icons/calendars/ic_arrow_prev.svg';
import IC_ARROW_NEXT from '@/assets/icons/calendars/ic_arrow_next.svg';
import IC_ADD_MARK from '@/assets/icons/schedules/ic_add.svg';
import IC_MONTH_NEXT from '@/assets/icons/calendars/ic_month_next.svg';
import IC_MONTH_PREV from '@/assets/icons/calendars/ic_month_prev.svg';
import IC_PLUS_MARK from '@/assets/icons/buttons/ic_plus_mark.svg';

interface CalendarHeaderProps {
  targetYear: String;
  targetMonth: number;
  targetType: String;
  onPressPrev: () => void;
  onPressNext: () => void;
  onPressAddSchedule: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  targetYear,
  targetMonth,
  targetType,
  onPressPrev,
  onPressNext,
  onPressAddSchedule,
}) => {
  const prevMonth = () => {
    if (targetMonth === 1) return 12;
    return targetMonth - 1;
  };

  const nextMonth = () => {
    if (targetMonth === 12) return 1;
    return targetMonth + 1;
  };

  return (
    <View style={{ paddingHorizontal: 16, backgroundColor: '#FFF' }}>
      {targetType !== 'A' && (
        <View
          style={{
            paddingVertical: 4,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <View style={[viewStyles.rowAiCenter]}>
            {targetType !== 'A' && (
              <Inter700Text style={{ fontSize: 24, color: '#000' }}>
                {targetYear}.{targetMonth}
              </Inter700Text>
            )}

            <TouchableOpacity onPress={onPressPrev}>
              <IC_MONTH_PREV style={{ padding: 16, marginLeft: 30 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressNext}>
              <IC_MONTH_NEXT style={{ padding: 16, marginLeft: 20 }} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            {/*
            <TouchableOpacity onPress={onPressAddSchedule}>
              <View style={{ flexDirection: 'row' }}>
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
                <Inter700Text style={{ color: '#8C8C8C', fontSize: 18 }}>
                  일정등록
                </Inter700Text>
              </View>
            </TouchableOpacity>
            */}
            <TouchableOpacity
              onPress={onPressAddSchedule}
              style={[viewStyles.rowAiCenterJcCenter, styles.btnStyle]}
            >
              <IC_PLUS_MARK />
              <Inter400Text style={{ color: '#ED7101', fontSize: 16 }}>
                일정등록
              </Inter400Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {targetType === 'A' && (
        <View
          style={{
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderStyle: 'dotted',
            borderBottomWidth: 2,
            borderBottomColor: '#D9D9D9',
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={onPressPrev}
          >
            <IC_ARROW_PREV />
            <Inter400Text style={{ fontSize: 18, color: '#000' }}>
              {prevMonth()}월
            </Inter400Text>
          </TouchableOpacity>
          <Inter700Text style={{ fontSize: 24, color: '#000' }}>
            {targetMonth}월
          </Inter700Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={onPressNext}
          >
            <Inter400Text style={{ fontSize: 18, color: '#000' }}>
              {nextMonth()}월
            </Inter400Text>
            <IC_ARROW_NEXT />
          </TouchableOpacity>
        </View>
      )}
      <View style={[viewStyles.rowAiCenterJcBetween]}>
        <View style={[{ position: 'relative' }]}>
          <View style={[styles.weekText]}>
            <Inter700Text
              style={[
                styles.calendarDayText,
                { color: '#FE8825', marginLeft: 4 },
              ]}
            >
              {' '}
              일
            </Inter700Text>
          </View>
        </View>
        <View style={[{ position: 'relative' }]}>
          <View style={[styles.weekText, styles.calendarDayView]}>
            <Inter700Text style={[styles.calendarDayText]}> 월</Inter700Text>
          </View>
        </View>
        <View style={[{ position: 'relative' }]}>
          <View style={[styles.weekText, styles.calendarDayView]}>
            <Inter700Text style={[styles.calendarDayText]}> 화</Inter700Text>
          </View>
        </View>
        <View style={[{ position: 'relative' }]}>
          <View style={[styles.weekText, styles.calendarDayView]}>
            <Inter700Text style={[styles.calendarDayText]}> 수</Inter700Text>
          </View>
        </View>
        <View style={[{ position: 'relative' }]}>
          <View style={[styles.weekText, styles.calendarDayView]}>
            <Inter700Text style={[styles.calendarDayText]}> 목</Inter700Text>
          </View>
        </View>
        <View style={[{ position: 'relative' }]}>
          <View style={[styles.weekText, styles.calendarDayView]}>
            <Inter700Text style={[styles.calendarDayText]}> 금</Inter700Text>
          </View>
        </View>
        <View style={[{ position: 'relative' }]}>
          <View style={[styles.weekText]}>
            <Inter700Text
              style={[
                styles.calendarDayText,
                { color: '#969696', marginLeft: 4 },
              ]}
            >
              {' '}
              토
            </Inter700Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarDayText: {
    color: '#000',
    fontSize: 18,
    lineHeight: 26,
  },
  weekText: {
    width: 40,
    height: 26,
    margin: 4,
  },
  calendarDayView: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    width: 100,
    height: 30,
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
  },
});

export default CalendarHeader;
