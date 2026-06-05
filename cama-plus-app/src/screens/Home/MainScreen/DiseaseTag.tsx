import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles } from '@/components/_StyleSheets';

interface Props {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

const DiseaseTag: React.FC<Props> = ({
  label,
  selected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.btnView,
        viewStyles.rowAiCenterJcCenter,
        selected && { backgroundColor: '#ED7101' },
      ]}
    >
      {selected && (
        <Inter700Text style={{ fontSize: 16, color: '#FFF' }}>
          {label}
        </Inter700Text>
      )}
      {!selected && (
        <Inter400Text style={{ fontSize: 16, color: '#ED7101' }}>
          {label}
        </Inter400Text>
      )}
    </TouchableOpacity>
  );
};

export default DiseaseTag;

const styles = StyleSheet.create({
  btnView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 4,
    borderRadius: 19,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },

});
