import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';

/** Types **/
import { ScheduleType } from '@/constants/enums';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';

/** Assets **/
import IC_ETC from '@/assets/icons/coaching/ic_etc.svg';
import IC_PILL from '@/assets/icons/coaching/ic_pill.svg';
import IC_HOSPITAL from '@/assets/icons/coaching/ic_hospital.svg';
import IC_TODO_OFF from '@/assets/icons/buttons/ic_todo_off.svg';
import IC_TODO_ON from '@/assets/icons/buttons/ic_todo_on.svg';

import { ScheduleInfo } from '@/services/apis/scheduleManager/response';

interface Props {
  disabled: boolean;
  isCompleted: boolean;
  title: string;
  time: string;
  desc: string;
  scheduleType: ScheduleType;
  onPress: () => void;
}

const ScheduleCard: React.FC<Props> = ({
  disabled,
  isCompleted,
  title,
  time,
  desc,
  scheduleType,
  onPress,
}) => {
  //console.log('isCompleted => ' + isCompleted);
  const scheduleIcon = (sType: ScheduleType) => {
    const COMMON_SIZE = 70;

    switch (sType) {
      case 'MEDICINE':
        return <IC_PILL width={COMMON_SIZE} height={COMMON_SIZE} />;
      case 'HOSPITAL':
        return <IC_HOSPITAL width={COMMON_SIZE} height={COMMON_SIZE} />;
      case 'ETC':
        return <IC_ETC width={COMMON_SIZE} height={COMMON_SIZE} />;

      /*
      case 'MEDICINE':
        return (
          <Image
            style={{
              width: COMMON_SIZE,
              height: COMMON_SIZE,
            }}
            source={require('@/assets/icons/coaching/ic_pill.png')}
            resizeMode="contain"
          />
        );
      case 'HOSPITAL':
        return (
          <Image
            style={{
              width: COMMON_SIZE,
              height: COMMON_SIZE,
            }}
            source={require('@/assets/icons/coaching/ic_hospital.png')}
            resizeMode="contain"
          />
        );
      case 'ETC':
        return (
          <Image
            style={{
              width: COMMON_SIZE,
              height: COMMON_SIZE,
            }}
            source={require('@/assets/icons/coaching/ic_etc.png')}
            resizeMode="contain"
          />
        );*/
      default:
        return '';
    }
  };

  const [hour, min] = time.split(':');
  return (
    <View style={[styles.wrap, borderStyles.basicBorder]}>
      <View style={[viewStyles.rowAiEndJcBetween]}>
        <Inter700Text
          style={{
            fontSize: 18,
            color: '#FE8825',
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          {title}
        </Inter700Text>
        <Inter700Text
          style={{
            fontSize: 18,
            color: '#444444',
          }}
        >
          {`${hour}:${min}`}
        </Inter700Text>
      </View>
      <View style={viewStyles.rowAiCenter}>
        {
          <Inter400Text
            style={{
              fontSize: 14,
              color: '#898A8D',
              marginLeft: 10,
              marginTop: 4,
            }}
          >
            {desc.length > 8 ? desc.substring(0, 8) + ' ...' : desc}
          </Inter400Text>
        }
      </View>

      <View style={[viewStyles.rowAiEndJcBetween, { marginTop: 10 }]}>
        {scheduleIcon(scheduleType)}
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity onPress={onPress}>
            {isCompleted ? (
              <IC_TODO_ON width={35} height={35} />
            ) : (
              <IC_TODO_OFF width={35} height={35} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ScheduleCard;

const styles = StyleSheet.create({
  wrap: {
    width: 170,
    height: 160,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
  buttonSection: {
    position: 'absolute',
    left: 40,
    right: 16,
    bottom: 10,
    width: 90,
  },
  buttonView: {
    height: 40,
    borderRadius: 26,
    backgroundColor: '#ED7101',
  },
});
