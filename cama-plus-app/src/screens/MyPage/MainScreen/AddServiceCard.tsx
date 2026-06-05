import React, { Fragment } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { borderStyles, viewStyles } from '@/components/_StyleSheets';

/** Assets **/
import IC_PLUS_MARK_S from '@/assets/icons/buttons/ic_plus_mark_s.svg';

interface Props {
  onAddService: () => void;
}

const AddServiceCard: React.FC<Props> = ({
  onAddService,
}) => {
  return (
    <View
      style={[styles.wrap, borderStyles.basicBorder]}
    >
      <Inter700Text style={{ color: '#000', fontSize: 18 }}>
        병환 추가
      </Inter700Text>
      <Inter400Text style={{ color: '#7E7E7E', fontSize: 12, marginTop: 6 }}>
        병환을 추가하려면 담당 의사에게 승인 신청을 해야합니다.
      </Inter400Text>
      <TouchableOpacity
        onPress={() => {}}
        style={[
          {
            borderRadius: 26,
            height: 30,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#ED7101',
            backgroundColor: '#FFF',
            marginTop: 26,
          },
          viewStyles.rowAiCenterJcCenter,
        ]}
      >
        <TouchableOpacity
          onPress={onAddService}
          style={viewStyles.rowAiCenterJcCenter}
        >
          <IC_PLUS_MARK_S />
          <Inter700Text style={{ fontSize: 14, color: '#ED7101' }}>
            병환 추가 신청
          </Inter700Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default AddServiceCard;

const styles = StyleSheet.create({
  wrap: {
    width: 152,
    height: 170,
    padding: 16,
    marginRight: 8,
  },
  gaugeSection: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
});
