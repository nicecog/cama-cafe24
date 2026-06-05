import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';

/** Assets **/
import IC_CHECK_MARK2_ON from '@/assets/icons/buttons/ic_check_mark2_on.svg';
import IC_CHECK_MARK2_OFF from '@/assets/icons/buttons/ic_check_mark2_off.svg';

interface Props {
  msg: string;
  selected: boolean;
  onSelect: () => void;
}

const CheckMessage: React.FC<Props> = ({
  msg,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.msgView,
        viewStyles.rowAiCenter,
        selected && { borderColor: '#ED7101' }
      ]}
      onPress={onSelect}
    >
      {selected && <IC_CHECK_MARK2_ON style={{ marginRight: 8 }} />}
      {!selected && <IC_CHECK_MARK2_OFF style={{ marginRight: 8 }} />}
      {selected && (
        <Inter700Text style={{ fontSize: 18, color: '#ED7101' }}>
          {msg}
        </Inter700Text>
      )}
      {!selected && (
        <Inter400Text style={{ fontSize: 18, color: '#000' }}>
          {msg}
        </Inter400Text>
      )}
    </TouchableOpacity>
  );
};

export default CheckMessage;

const styles = StyleSheet.create({
  msgView: {
    marginTop: 16,
  },
});
