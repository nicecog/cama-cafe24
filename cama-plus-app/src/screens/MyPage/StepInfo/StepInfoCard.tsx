import React from 'react';
import { View, StyleSheet } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { borderStyles } from '@/components/_StyleSheets';

interface Props {
  seq: number;
  executionDate: string;
  stepNum: number;
}

const StepInfoCard: React.FC<Props> = ({ seq, executionDate, stepNum }) => {
  return (
    <View style={[styles.wrap, borderStyles.basicBorder]}>
      <Inter700Text style={{ color: '#000', fontSize: 14 }}>
        날짜 : {executionDate}
      </Inter700Text>

      <Inter400Text style={{ color: '#000', fontSize: 14 }}>
        걸음수 : {stepNum}
      </Inter400Text>
    </View>
  );
};

export default StepInfoCard;

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
});
