import React from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/** Styles **/
import { viewStyles, borderStyles } from '@/components/_StyleSheets';
import { Inter700Text } from '@/components/Texts/InterText';

/** Assets **/
import IC_LEFT_BACK from '@/assets/icons/headers/ic_left_back.svg';
import IC_LOGO from '@/assets/icons/logo/logo.svg';
import MY_PAGE_TAB_ACTIVE from '@/assets/icons/bottomTabs/icon_my_on.svg';
import MY_PAGE_TAB_INACTIVE from '@/assets/icons/bottomTabs/icon_my_off.svg';
import HELP_PAGE from '@/assets/icons/headers/help7.svg';

interface Props {
  borderBottom?: boolean;
}

const HomeMainHeader: React.FC<Props> = ({ borderBottom = true }) => {
  const navigation = useNavigation();

  const onPressBack = () => {
    //navigation.goBack();
    navigation.navigate('HomeMainScreen');
  };

  const onPressMyPage = () => {
    //navigation.goBack();
    navigation.navigate('MyPageMainScreen');
  };

  const onPressHelpPage = () => {
    //navigation.goBack();
    navigation.navigate('HelpPageMainScreen');
  };

  return (
    <View
      style={[
        {
          height: 50,
          paddingLeft: 12,
          justifyContent: 'center',
        },
        borderBottom && borderStyles.borderB,
      ]}
    >
      <View style={[viewStyles.rowAiCenterJcBetween]}>
        <TouchableOpacity
          style={[viewStyles.rowAiCenter]}
          onPress={onPressBack}
        >
          <IC_LOGO width={100} height={100} />
        </TouchableOpacity>
        <View style={[viewStyles.rowAiCenterJcBetween]}>
          <TouchableOpacity
            style={[
              {
                height: 50,
                paddingRight: 6,
                justifyContent: 'center',
              },
            ]}
            onPress={onPressMyPage}
          >
            <MY_PAGE_TAB_INACTIVE width={26} height={26} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                height: 50,
                paddingRight: 10,
                justifyContent: 'center',
              },
            ]}
            onPress={onPressHelpPage}
          >
            <HELP_PAGE width={26} height={26} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeMainHeader;
