import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';

/** Types **/

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';

/** Assets **/
import SLEEP from '@/assets/icons/coaching/sleep.svg';
import EXCERCISE from '@/assets/icons/coaching/excercise.svg';
import ACTIVITY from '@/assets/icons/coaching/activity.svg';
import MENTAL from '@/assets/icons/coaching/mental.svg';
import DIETARY from '@/assets/icons/coaching/dietary.svg';
import IC_LABEL_INDICATOR_P from '@/assets/icons/common/ic_label_indicator_p.svg';

interface Props {
  categoryCd: string;
  categoryNm: string;
  progress: number;
  onPress: () => void;
}

const CoachingCard: React.FC<Props> = ({
  categoryCd,
  categoryNm,
  progress,
  onPress,
}) => {
  const categoryIcon = (categoryCd: string) => {
    const COMMON_SIZE = 70;
    /* A:수면, B:식습관, C:신체활동, D:심리, E:운동 */
    switch (categoryCd) {
      case 'A':
        return <SLEEP width={COMMON_SIZE} height={COMMON_SIZE} />;
      case 'B':
        return <DIETARY width={COMMON_SIZE} height={COMMON_SIZE} />;
      case 'C':
        return <ACTIVITY width={COMMON_SIZE} height={COMMON_SIZE} />;
      case 'D':
        return <MENTAL width={COMMON_SIZE} height={COMMON_SIZE} />;
      case 'E':
        return <EXCERCISE width={COMMON_SIZE} height={COMMON_SIZE} />;
      default:
        return '';
      /*
      case 'A':
        return (
          <Image
            style={{
              width: COMMON_SIZE,
              height: COMMON_SIZE,
            }}
            source={require('@/assets/icons/coaching/sleep.png')}
            resizeMode="contain"
          />
        );
      case 'B':
        return (
          <Image
            style={{
              width: COMMON_SIZE,
              height: COMMON_SIZE,
            }}
            source={require('@/assets/icons/coaching/dietary.png')}
            resizeMode="contain"
          />
        );
      case 'C':
        return (
          <Image
            style={{
              width: COMMON_SIZE,
              height: COMMON_SIZE,
            }}
            source={require('@/assets/icons/coaching/activity.png')}
            resizeMode="contain"
          />
        );
      case 'D':
        return (
          <Image
            style={{
              width: COMMON_SIZE,
              height: COMMON_SIZE,
            }}
            source={require('@/assets/icons/coaching/mental.png')}
            resizeMode="contain"
          />
        );
      case 'E':
        return (
          <Image
            style={{
              width: COMMON_SIZE,
              height: COMMON_SIZE,
            }}
            source={require('@/assets/icons/coaching/excercise.png')}
            resizeMode="contain"
          />
        );
      default:
        return '';
        */
    }
  };

  const categoryComment = (categoryCd: string) => {
    switch (categoryCd) {
      case 'A':
        return '카마코치와 함께 건강한 수면 습관을 만들어 보세요.';
      case 'B':
        return '나에게 맞는 영양과 식습관 변화로 더 건강해져요.';
      case 'C':
        return '신체활동으로 활기찬 하루를\n시작하세요.';
      case 'D':
        return '나의 대처 유형에 맞게 마음을 다스려보아요.';
      case 'E':
        return '나에게 맞는 운동을 찾고 \n따라해보세요.';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.wrap, borderStyles.basicBorder]}>
      <View style={viewStyles.rowAiCenter}>
        <Inter700Text style={{ fontSize: 18, color: '#774F2D', marginLeft: 2 }}>
          {categoryNm}
        </Inter700Text>
      </View>
      <View style={viewStyles.rowAiCenter}>
        <Inter400Text
          style={{
            color: '#444444',
            fontSize: 14,
            marginLeft: 2,
            marginTop: 2,
          }}
        >
          {categoryComment(categoryCd)}
        </Inter400Text>
      </View>
      <View style={viewStyles.rowAiEndJcBetween}>
        <Inter700Text
          style={{
            fontSize: 28,
            color: '#FE8825',
            marginLeft: 2,
            marginTop: 46,
          }}
        >
          {progress}%
        </Inter700Text>
        {categoryIcon(categoryCd)}
      </View>
      <View style={styles.buttonSection}>
        <TouchableOpacity
          onPress={onPress}
          style={[viewStyles.rowAiCenterJcCenter]}
        >
          <Inter400Text
            style={{
              color: '#ED7101',
              fontSize: 16,
              marginBottom: 10,
              marginTop: 6,
            }}
          >
            이동
          </Inter400Text>
          <IC_LABEL_INDICATOR_P />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CoachingCard;

const styles = StyleSheet.create({
  wrap: {
    width: 200,
    height: 220,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
  buttonSection: {
    position: 'absolute',
    left: 100,
    right: 2,
    bottom: 2,
  },
  buttonView: {
    width: 100,
    height: 30,
    borderRadius: 26,
    backgroundColor: '#ED7101',
  },
});
