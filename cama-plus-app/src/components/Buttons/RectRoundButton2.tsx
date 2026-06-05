import React from 'react';
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

/** Styles **/
import { viewStyles } from '@/components/_StyleSheets';
import { Inter700Text } from '@/components/Texts/InterText';

export interface RectRoundButtonProps {
  label: string;
  shadow?: boolean;
  disabled?: boolean;
  showIndicator?: boolean;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const RectRoundButton2: React.FC<RectRoundButtonProps> = ({
  label,
  shadow = true,
  disabled = false,
  showIndicator = false,
  onPress = () => {},
  buttonStyle = {},
  textStyle = { color: '#FFFFFF' },
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      {
        height: 68,
        backgroundColor: '#ED7101',
      },
      viewStyles.rowAiCenterJcCenter,
      shadow && styles.shadow,
      buttonStyle,
      disabled && { backgroundColor: '#DDDDDD' },
    ]}
  >
    {showIndicator ? (
      <ActivityIndicator color={'#fff'} />
    ) : (
      <Inter700Text style={[{ fontSize: 20 }, textStyle]}>{label}</Inter700Text>
    )}
  </TouchableOpacity>
);

export default RectRoundButton2;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'rgba(237, 113, 1, 0.50)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 6,
  },
});
