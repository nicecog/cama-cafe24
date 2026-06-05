import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';

/** Assets **/
import IC_CHECK_MARK from '@/assets/icons/buttons/ic_check_mark.svg';

interface Props {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const SelectedCheckCareTrackButton: React.FC<Props> = ({
  label,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnView,
        viewStyles.rowAiCenter,
        borderStyles.buttonBorder,
        selected && {
          backgroundColor: '#FFF',
          borderColor: '#ED7101',
          width: 300,
        },
        !selected && {
          backgroundColor: '#F9F9F9',
          borderColor: '#F9F9F9',
          width: 300,
        },
      ]}
      onPress={onSelect}
    >
      {selected && <IC_CHECK_MARK style={{ marginRight: 4 }} />}
      {selected && (
        <Inter700Text style={{ fontSize: 16, color: '#FE8825' }}>
          {label}
        </Inter700Text>
      )}
      {!selected && (
        <Inter400Text style={{ fontSize: 16, color: '#777777' }}>
          {label}
        </Inter400Text>
      )}
    </TouchableOpacity>
  );
};

export default SelectedCheckCareTrackButton;

const styles = StyleSheet.create({
  btnView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F4F4F4',
    borderColor: '#ED7101',
    borderRadius: 18,
    marginRight: 14,
    marginBottom: 4,
  },
});
