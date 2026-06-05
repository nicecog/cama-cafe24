import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles } from '@/components/_StyleSheets';

/** Assets **/
import IC_CHECK_MARK from '@/assets/icons/buttons/ic_check_mark.svg';

interface Props {
  name: string;
  major: string;
  selected: boolean;
  onSelect: () => void;
}

const DoctorCheckCell: React.FC<Props> = ({
  name,
  major,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnView,
        viewStyles.rowAiCenterJcBetween,
        selected && { backgroundColor: 'rgba(30, 113, 192, 0.1)' }
      ]}
      onPress={onSelect}
    >

      {selected && (
        <View style={viewStyles.rowAiCenter}>
          <Inter700Text style={{ fontSize: 24, color: '#000' }}>
            {name}
          </Inter700Text>
          <Inter700Text style={{ fontSize: 16, color: '#696969', marginLeft: 8 }}>
            {major}
          </Inter700Text>
        </View>
      )}
      {!selected && (
        <View style={viewStyles.rowAiCenter}>
          <Inter400Text style={{ fontSize: 24, color: '#000' }}>
            {name}
          </Inter400Text>
          <Inter400Text style={{ fontSize: 16, color: '#696969', marginLeft: 8 }}>
            {major}
          </Inter400Text>
        </View>
      )}
      {selected && <IC_CHECK_MARK style={{ marginRight: 4 }} />}
    </TouchableOpacity>
  );
};

export default DoctorCheckCell;

const styles = StyleSheet.create({
  btnView: {
    marginBottom: 8,
    padding: 16,
  },
});
