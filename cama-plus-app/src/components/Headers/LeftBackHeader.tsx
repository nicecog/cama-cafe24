import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

/** Styles **/
import { viewStyles, borderStyles } from '@/components/_StyleSheets';
import { Inter700Text } from '@/components/Texts/InterText';

/** Assets **/
import IC_LEFT_BACK from '@/assets/icons/headers/ic_left_back.svg';

interface Props {
  borderBottom?: boolean;
  title: String;
}

const LeftBackHeader: React.FC<Props> = ({ borderBottom = true, title }) => {
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
        borderBottom && borderStyles.borderB,
      ]}
    >
      <View style={[viewStyles.rowAiStart]}>
        <TouchableOpacity style={[viewStyles.rowAiStart]} onPress={onPressBack}>
          {Platform.OS === 'ios' && (
            <View style={{ marginTop: -2 }}>
              <IC_LEFT_BACK />
            </View>
          )}
          {Platform.OS !== 'ios' && (
            <View style={{ marginTop: 2 }}>
              <IC_LEFT_BACK />
            </View>
          )}
          <Inter700Text style={{ fontSize: 18, color: '#000' }}>
            뒤로
          </Inter700Text>
        </TouchableOpacity>
        {title !== '' && (
          <View
            style={{ flex: 9, justifyContent: 'center', alignItems: 'center' }}
          >
            <Inter700Text
              style={{
                marginLeft: -50,
                fontSize: 20,
                color: '#444444',
                marginTop: -2,
              }}
            >
              {title}
            </Inter700Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default LeftBackHeader;
