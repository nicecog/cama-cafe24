import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';

interface Props {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const AmPmButton: React.FC<Props> = ({ label, selected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.ampmBtnView, selected && { backgroundColor: '#FE8825' }]}
      onPress={onSelect}
    >
      {selected && (
        <Inter700Text style={{ fontSize: 17, color: '#FFF' }}>
          {label}
        </Inter700Text>
      )}
      {!selected && (
        <Inter400Text style={{ fontSize: 17, color: '#7E7E7E' }}>
          {label}
        </Inter400Text>
      )}
    </TouchableOpacity>
  );
};

export default AmPmButton;

const styles = StyleSheet.create({
  ampmBtnView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 32,
  },
});
