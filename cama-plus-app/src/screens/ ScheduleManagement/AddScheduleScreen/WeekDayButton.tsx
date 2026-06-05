import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles } from '@/components/_StyleSheets';

interface Props {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const WeekDayButton: React.FC<Props> = ({ label, selected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[
        styles.wrap,
        viewStyles.rowAiCenterJcCenter,
        selected && { backgroundColor: '#FE8825', borderColor: '#ED7101' },
        !selected && { backgroundColor: '#F7F7F7', borderColor: '#EDEDED' },
      ]}
      onPress={onSelect}
    >
      {selected && (
        <Inter700Text style={{ fontSize: 17, color: '#FFFFFF' }}>
          {label}
        </Inter700Text>
      )}
      {!selected && (
        <Inter400Text style={{ fontSize: 17, color: '#777777' }}>
          {label}
        </Inter400Text>
      )}
    </TouchableOpacity>
  );
};

export default WeekDayButton;

const styles = StyleSheet.create({
  wrap: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
