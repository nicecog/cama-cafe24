import React from 'react';
import { View, StyleSheet } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { borderStyles, viewStyles } from '@/components/_StyleSheets';

interface Props {
  label: string;
  value: string;
  borderBottom?: boolean;
}

const InfoRow: React.FC<Props> = ({
  label,
  value,
  borderBottom = true,
}) => {
  return (
    <View
      style={[
        viewStyles.rowAiEndJcBetween,
        styles.rowView,
        borderBottom && borderStyles.borderB,
      ]}
    >
      <Inter400Text style={{ color: '#696969', fontSize: 18 }}>
        {label}
      </Inter400Text>
      <Inter700Text style={{ color: '#000', fontSize: 18 }}>
        {value}
      </Inter700Text>
    </View>
  );
};

export default InfoRow;

const styles = StyleSheet.create({
  rowView: {
    paddingVertical: 16,
  },
});
