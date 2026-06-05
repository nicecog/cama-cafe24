import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

/** Styles **/
import { Inter400Text } from '@/components/Texts/InterText';
import { viewStyles } from '@/components/_StyleSheets';

/** Assets **/
import IC_TAG_X_MARK from '@/assets/icons/buttons/ic_tag_x_mark.svg';

interface Props {
  name: string;
  onPress: () => void;
}

const SelectedDoctorTag: React.FC<Props> = ({
  name,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnView,
        viewStyles.rowAiCenter,
      ]}
      onPress={onPress}
    >
      <Inter400Text style={{ fontSize: 16, color: '#ED7101' }}>
        {name} 의사
      </Inter400Text>
      <IC_TAG_X_MARK />
    </TouchableOpacity>
  );
};

export default SelectedDoctorTag;

const styles = StyleSheet.create({
  btnView: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 16.5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
  },

});
