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

const SelectedCheckButton: React.FC<Props> = ({
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
        },
        !selected && {
          backgroundColor: '#F9F9F9',
          borderColor: '#F9F9F9',
        },
        selected &&
          label === '복약' && {
            backgroundColor: '#FFFFFF',
            borderColor: '#dd5e17',
          },
        label === '내원' && {
          backgroundColor: '#FFFFFF',
          borderColor: '#6cb77e',
        },
        label === '기타' && {
          backgroundColor: '#FFFFFF',
          borderColor: '#777777',
        },
        !selected &&
          label === '복약' && {
            backgroundColor: '#E4E4E4',
            borderColor: '#EAEAEA',
          },
        !selected &&
          label === '내원' && {
            backgroundColor: '#E4E4E4',
            borderColor: '#EAEAEA',
          },
        !selected &&
          label === '기타' && {
            backgroundColor: '#E4E4E4',
            borderColor: '#EAEAEA',
          },
      ]}
      onPress={onSelect}
    >
      {selected && <IC_CHECK_MARK style={{ marginRight: 4 }} />}
      {label === '복약' && (
        <Inter700Text
          style={{
            fontSize: 16,
            color: '#dd5e17',
          }}
        >
          {label}
        </Inter700Text>
      )}
      {label === '내원' && (
        <Inter700Text
          style={{
            fontSize: 16,
            color: '#6cb77e',
          }}
        >
          {label}
        </Inter700Text>
      )}
      {label === '기타' && (
        <Inter700Text
          style={{
            fontSize: 16,
            color: '#777777',
          }}
        >
          {label}
        </Inter700Text>
      )}
    </TouchableOpacity>
  );
};

export default SelectedCheckButton;

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
