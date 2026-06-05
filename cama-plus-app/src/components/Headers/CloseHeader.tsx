import React from 'react';
import { View, TouchableOpacity } from 'react-native';

/** Styles **/
import { Inter400Text } from '@/components/Texts/InterText';

/** Assets **/
import IC_X_BTN from '@/assets/icons/buttons/ic_x_btn_black.svg';

interface CloseHeaderProps {
  title: string;
  onPress: () => void;
}

const CloseHeader: React.FC<CloseHeaderProps> = ({
  title,
  onPress,
}) => {
  return (
    <View
      style={[
        {
          height: 50,
          backgroundColor: '#F6F6F6',
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      ]}
    >
      <TouchableOpacity
        style={{
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0,
        }}
        disabled={true}
      >
        <IC_X_BTN />
      </TouchableOpacity>
      <View>
        <Inter400Text
          style={{ fontSize: 16, color: '#1F2025', textAlign: 'center' }}
        >
          {title}
        </Inter400Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <IC_X_BTN />
      </TouchableOpacity>
    </View>
  );
};

export default CloseHeader;
