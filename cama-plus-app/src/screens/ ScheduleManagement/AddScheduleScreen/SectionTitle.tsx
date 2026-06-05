import React from 'react';
import { View } from 'react-native';

/** Styles **/
import { viewStyles } from '@/components/_StyleSheets';
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';

interface Props {
  boldText: string;
  etcText: string;
}

const SectionTitle: React.FC<Props> = ({ boldText, etcText }) => {
  return (
    <View style={viewStyles.rowAiCenter}>
      <Inter700Text style={{ fontSize: 18, color: '#000' }}>
        {boldText}
      </Inter700Text>
      <Inter400Text style={{ fontSize: 18, color: '#000' }}>
        {etcText}
      </Inter400Text>
    </View>
  );
};

export default SectionTitle;
