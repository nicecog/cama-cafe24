import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import dayjs from 'dayjs';

/** Types **/
import { ScheduleInfo } from '@/services/apis/scheduleManager/response';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';

/** Utils & Helpers **/
import { generateWeeks } from '@/utils/dayjs';

interface Props {
  yearMonth: string;
  targetDay: string;
  monthlyTargetList?: ScheduleInfo[];
  onSelectDate: (day: string) => void;
}

const CalendarView: React.FC<Props> = ({
  yearMonth,
  targetDay,
  monthlyTargetList = [],
  onSelectDate,
}) => {
  const lastDay = dayjs(yearMonth).daysInMonth();
  const weeks = generateWeeks(yearMonth, lastDay);
  const monthlyTargetDays = monthlyTargetList.map(
    d => `${Number(d.startDate.split('-')[2]) + d.scheduleType}`,
  );
  //console.log('monthlyTargetDays ' + monthlyTargetDays);

  return (
    <View
      style={[
        styles.calendarView,
        borderStyles.borderB,
        { backgroundColor: '#FFF' },
      ]}
    >
      {weeks.map(w => (
        <View key={w.key} style={viewStyles.rowAiCenterJcBetween}>
          {Object.entries(w.week).map(([k, d]) => {
            const selectedDay = `${Number(targetDay)}` === d.day;

            return (
              <TouchableOpacity
                key={k}
                disabled={d.day === ''}
                style={{ position: 'relative' }}
                onPress={() => onSelectDate(d.day)}
              >
                <View
                  style={[
                    { width: 40, height: 26, margin: 4 },
                    d.day !== '' && styles.calendarDayView,
                    d.day !== '' &&
                      d.weekDay === 0 && { borderColor: '#FE8825' },
                    d.day !== '' &&
                      d.weekDay === 6 && { borderColor: '#969696' },
                    selectedDay && {
                      backgroundColor: '#FEBA00',
                      borderRadius: 20,
                    },
                  ]}
                >
                  {d.day === '' && (
                    <Inter400Text
                      style={[
                        styles.calendarDayText,
                        d.weekDay === 0 && { color: '#FE8825' },
                        d.weekDay === 6 && { color: '#969696' },
                        { opacity: 0.5 },
                      ]}
                    >
                      {d.day}
                    </Inter400Text>
                  )}
                  {d.day !== '' && (
                    <Inter700Text
                      style={[
                        styles.calendarDayText,
                        d.weekDay === 0 && { color: '#FE8825' },
                        d.weekDay === 6 && { color: '#969696' },
                        selectedDay && { color: '#fff' },
                      ]}
                    >
                      {d.day}
                    </Inter700Text>
                  )}
                </View>
                {/*
                <View style={viewStyles.rowAiCenterJcCenter}>
                  {monthlyTargetDays.includes(d.day + 'MEDICINE') ? (
                    <View style={styles.markedMedicineView} />
                  ) : (
                    <View style={styles.emptyMarkedView} />
                  )}
                  {monthlyTargetDays.includes(d.day + 'HOSPITAL') ? (
                    <View style={styles.markedHospitalView} />
                  ) : (
                    <View style={styles.emptyMarkedView} />
                  )}
                  {monthlyTargetDays.includes(d.day + 'ETC') ? (
                    <View style={styles.markedEtcView} />
                  ) : (
                    <View style={styles.emptyMarkedView} />
                  )}
                    */}
                <View style={viewStyles.rowAiCenterJcCenter}>
                  {monthlyTargetDays.includes(d.day + 'MEDICINE') ? (
                    <View style={styles.markedMedicineView} />
                  ) : (
                    <View style={styles.emptyMarkedView} />
                  )}
                  {monthlyTargetDays.includes(d.day + 'HOSPITAL') ? (
                    <View style={styles.markedHospitalView} />
                  ) : (
                    <View style={styles.emptyMarkedView} />
                  )}
                  {monthlyTargetDays.includes(d.day + 'ETC') ? (
                    <View style={styles.markedEtcView} />
                  ) : (
                    <View style={styles.emptyMarkedView} />
                  )}
                  {!monthlyTargetDays.includes(d.day + 'MEDICINE') &&
                  !monthlyTargetDays.includes(d.day + 'HOSPITAL') &&
                  !monthlyTargetDays.includes(d.day + 'ETC') ? (
                    <View style={styles.emptyMarkedView2} />
                  ) : (
                    <View style={styles.emptyMarkedView} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default CalendarView;

const styles = StyleSheet.create({
  calendarView: {
    paddingHorizontal: 16,
    paddingTop: 1,
    paddingBottom: 8,
  },
  calendarDayView: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayText: {
    color: '#000',
    fontSize: 18,
    lineHeight: 26,
  },
  markedMedicineView: {
    width: 6,
    height: 6,
    marginLeft: 2,
    borderRadius: 6,
    backgroundColor: '#dd5e17',
  },
  markedHospitalView: {
    width: 6,
    height: 6,
    marginLeft: 2,
    borderRadius: 6,
    backgroundColor: '#6cb77e',
  },
  markedEtcView: {
    width: 6,
    height: 6,
    marginLeft: 2,
    borderRadius: 6,
    backgroundColor: '#777777',
  },
  emptyMarkedView: {
    width: 0,
    height: 0,
    borderRadius: 0,
  },
  emptyMarkedView2: {
    width: 6,
    height: 6,
    borderRadius: 6,
  },
});
