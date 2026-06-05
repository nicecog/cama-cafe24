import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';

/** Types **/
import { ContentsInfo } from '@/services/apis/contents/response';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import {
  viewStyles,
  borderStyles,
  gaugeStyles,
} from '@/components/_StyleSheets';

/** Assets **/
import IC_LABEL_INDICATOR_P from '@/assets/icons/common/ic_label_indicator_p.svg';

interface Props {
  contentsInfo?: ContentsInfo;
  percent?: number;
  masking?: boolean;
}

const ContentCard: React.FC<Props> = ({
  contentsInfo,
  percent = 0,
  masking = false,
}) => {
  return (
    <View
      style={[styles.wrap, viewStyles.rowAiStart, borderStyles.basicBorder]}
    >
      {(contentsInfo === undefined ||
        contentsInfo === null ||
        contentsInfo.image === null) && <View style={styles.imgView} />}
      {contentsInfo !== undefined &&
        contentsInfo !== null &&
        contentsInfo.image !== null && (
          <Image
            style={styles.imgView}
            source={{ uri: contentsInfo.image }}
            resizeMode={'cover'}
          />
        )}
      <View style={[{ marginLeft: 16, flex: 1 }, viewStyles.columnJcBetween]}>
        <View style={{ flex: 1 }}>
          <Inter700Text
            style={{ fontSize: 16, color: '#000' }}
            numberOfLines={3}
          >
            {contentsInfo?.title}
          </Inter700Text>
        </View>
        {percent === 0 && (
          <View style={[viewStyles.rowAiCenterJcEnd]}>
            <View style={viewStyles.rowAiCenter}>
              <Inter400Text style={{ color: '#ED7101', fontSize: 16 }}>
                읽기
              </Inter400Text>
              <IC_LABEL_INDICATOR_P />
            </View>
          </View>
        )}
        {percent > 0 && (
          <View>
            <Inter400Text style={{ color: '#ED7101', fontSize: 16 }}>
              <Inter700Text style={{ color: '#ED7101', fontSize: 20 }}>
                {percent}%
              </Inter700Text>
              {' 읽었어요'}
            </Inter400Text>
            <View style={[gaugeStyles.gaugeView, { marginTop: 4 }]}>
              <View
                style={[gaugeStyles.gaugeFilledView, { width: `${percent}%` }]}
              />
            </View>
          </View>
        )}
      </View>
      {masking && (
        <View style={[styles.maskingView, viewStyles.rowAiCenterJcCenter]}>
          <Inter700Text style={styles.maskingLabel}>
            암정보 가이드를 설정하면 김카마님에게 맞는 가이드를 추천해드려요.
          </Inter700Text>
        </View>
      )}
    </View>
  );
};

export default ContentCard;

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  imgView: {
    width: 113,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#CDCDCD',
  },
  maskingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  maskingLabel: {
    fontSize: 18,
    color: '#FFF',
    width: 176,
    textAlign: 'center',
  },
});
