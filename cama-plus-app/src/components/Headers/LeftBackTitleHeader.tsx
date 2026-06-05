import React from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/** Styles **/
import { viewStyles, borderStyles } from '@/components/_StyleSheets';
import { Inter700Text } from '@/components/Texts/InterText';

/** Assets **/
import IC_LEFT_BACK from '@/assets/icons/headers/ic_left_back.svg';

interface Props {
  title: string;
  borderBottom?: boolean;
}

const LeftBackTitleHeader: React.FC<Props> = ({
  title,
  borderBottom = true,
}) => {
  const navigation = useNavigation();

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        {
          height: 50,
          paddingLeft: 12,
          justifyContent: 'center',
        },
        borderBottom && borderStyles.borderB
      ]}
    >
      <TouchableOpacity
        style={[viewStyles.rowAiCenter]}
        onPress={onPressBack}
      >
        <IC_LEFT_BACK />
        <Inter700Text style={{ fontSize: 18, color: '#000' }}>{title}</Inter700Text>
      </TouchableOpacity>
    </View>
  );
};

export default LeftBackTitleHeader;
