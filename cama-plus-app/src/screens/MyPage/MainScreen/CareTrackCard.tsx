import React, { Fragment } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import RectRoundButton from '@/components/Buttons/RectRoundButton';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import {
  borderStyles,
  viewStyles,
  gaugeStyles,
} from '@/components/_StyleSheets';

/** Assets **/
import IC_LABEL_INDICATOR_P from '@/assets/icons/common/ic_label_indicator_p.svg';

interface Props {
  isApplied: boolean;
  percent?: number;
  cancer: string;
  hospital: string;
  doctor: string;
  startDate?: string;
  onShowDetail: () => void;
  onApplyCareTrack: () => void;
}

const CareTrackCard: React.FC<Props> = ({
  isApplied,
  percent = 0,
  cancer,
  hospital,
  doctor,
  startDate = '',
  onShowDetail,
  onApplyCareTrack,
}) => {
  return (
    <View style={[styles.wrap, borderStyles.basicBorder]}>
      {!isApplied && (
        <Inter400Text style={{ color: '#000', fontSize: 12 }}>
          암정보 가이드 설정 가능
        </Inter400Text>
      )}
      {isApplied && (
        <Inter400Text
          style={{
            color: percent === 100 ? '#7E7E7E' : '#ED7101',
            fontSize: 12,
          }}
        >
          암정보 가이드 {percent === 100 ? '완료' : '진행중'}
        </Inter400Text>
      )}
      <TouchableOpacity onPress={onShowDetail} style={viewStyles.rowAiCenter}>
        <Inter700Text style={{ fontSize: 18, color: '#ED7101' }}>
          {cancer}
        </Inter700Text>
        <IC_LABEL_INDICATOR_P />
      </TouchableOpacity>
      <Inter400Text style={{ color: '#7E7E7E', fontSize: 12, marginTop: 8 }}>
        {hospital}
      </Inter400Text>
      <Inter700Text style={{ fontSize: 14, color: '#000', marginTop: 2 }}>
        {doctor}
        <Inter700Text style={{ fontSize: 12, color: '#000' }}>
          {' 의사'}
        </Inter700Text>
      </Inter700Text>
      <View style={styles.gaugeSection}>
        {isApplied && (
          <Fragment>
            <View style={viewStyles.rowAiEndJcBetween}>
              <Inter400Text style={{ color: '#7E7E7E', fontSize: 10 }}>
                {startDate}~
              </Inter400Text>
              <Inter700Text style={{ fontSize: 20, color: '#ED7101' }}>
                {percent}%
              </Inter700Text>
            </View>
            <View style={[gaugeStyles.gaugeView, { marginTop: 4 }]}>
              <View
                style={[gaugeStyles.gaugeFilledView, { width: `${percent}%` }]}
              />
            </View>
          </Fragment>
        )}
        {!isApplied && (
          <Fragment>
            <RectRoundButton
              label={'암정보 가이드 설정'}
              shadow={false}
              onPress={onApplyCareTrack}
              buttonStyle={{ height: 30, borderRadius: 26 }}
              textStyle={{ fontSize: 14, color: '#FFF' }}
            />
          </Fragment>
        )}
      </View>
    </View>
  );
};

export default CareTrackCard;

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
