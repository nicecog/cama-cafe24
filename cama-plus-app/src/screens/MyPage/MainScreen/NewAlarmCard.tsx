import React from 'react';
import { View, StyleSheet } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { borderStyles } from '@/components/_StyleSheets';

interface Props {
  message: string;
  alarmDate: string;
  isLatest?: boolean;
}

const NewAlarmCard: React.FC<Props> = ({
  message,
  alarmDate,
  isLatest = false,
}) => {
  return (
    <View style={[styles.wrap, borderStyles.basicBorder]}>
      {isLatest && (
        <Inter700Text style={{ color: '#000', fontSize: 14 }}>
          {message}
        </Inter700Text>
      )}
      {!isLatest && (
        <Inter400Text style={{ color: '#000', fontSize: 14 }}>
          {message}
        </Inter400Text>
      )}
      <Inter400Text style={{ color: '#7E7E7E', fontSize: 10 }}>
        {alarmDate}~
      </Inter400Text>
    </View>
  );
};

export default NewAlarmCard;

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
});
