import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles } from '@/components/_StyleSheets';

/** Assets **/
import IC_CHECK_MARK from '@/assets/icons/buttons/ic_check_mark.svg';

interface Props {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const HospitalCheckCell: React.FC<Props> = ({
  label,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnView,
        viewStyles.rowAiCenterJcBetween,
        selected && { backgroundColor: 'rgba(237, 113, 1, 0.10)' }
      ]}
      onPress={onSelect}
    >

      {selected && (
        <Inter700Text style={{ fontSize: 24, color: '#000' }}>
          {label}
        </Inter700Text>
      )}
      {!selected && (
        <Inter400Text style={{ fontSize: 24, color: '#000' }}>
          {label}
        </Inter400Text>
      )}
      {selected && <IC_CHECK_MARK style={{ marginRight: 4 }} />}
    </TouchableOpacity>
  );
};

export default HospitalCheckCell;

const styles = StyleSheet.create({
  btnView: {
    marginBottom: 8,
    padding: 16,
  },
});
