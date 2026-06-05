import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

/** Styles **/
import { Inter400Text } from '@/components/Texts/InterText';
import { borderStyles, viewStyles } from '@/components/_StyleSheets';

interface Props {
  onPressTerms: () => void;
  onPressPrivacy: () => void;
}

const PolicyView: React.FC<Props> = ({ onPressTerms, onPressPrivacy }) => {
  return (
    <View style={{ marginTop: 8 }}>
      <View
        style={[
          styles.sectionView,
          borderStyles.basicBorder,
        ]}
      >
        <View
          style={[
            viewStyles.rowAiCenterJcBetween,
            { paddingVertical: 16 },
            borderStyles.borderB,
          ]}
        >
          <Inter400Text style={{ color: '#696969', fontSize: 18 }}>
            서비스 이용약관
          </Inter400Text>
          <TouchableOpacity onPress={onPressTerms}>
            <Inter400Text style={{ color: '#ED7101', fontSize: 14 }}>
              보기
            </Inter400Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            viewStyles.rowAiCenterJcBetween,
            { paddingVertical: 16 },
          ]}
        >
          <Inter400Text style={{ color: '#696969', fontSize: 18 }}>
            개인정보 처리방침
          </Inter400Text>
          <TouchableOpacity onPress={onPressPrivacy}>
            <Inter400Text style={{ color: '#ED7101', fontSize: 14 }}>
              보기
            </Inter400Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PolicyView;

const styles = StyleSheet.create({
  sectionView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
