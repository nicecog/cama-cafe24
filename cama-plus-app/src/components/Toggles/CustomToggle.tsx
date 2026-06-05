import React, { useState } from 'react';
import { Animated, Easing, Pressable } from 'react-native';

interface Props {
  isOn: boolean;
  onToggle: () => void;
}

const CustomToggle: React.FC<Props> = ({ isOn, onToggle }) => {
  const [aniValue, setAniValue] = useState(new Animated.Value(0));

  const moveSwitchToggle = aniValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  Animated.timing(aniValue, {
    toValue: isOn ? 1 : 0,
    duration: 200,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start();

  return (
    <Pressable
      onPress={onToggle}
      style={{
        backgroundColor: '#FFF',
        width: 40,
        height: 24,
        borderRadius: 20,
        paddingHorizontal: 4,
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: isOn ? '#ED7101' : '#D3D3D3',
      }}
    >
      <Animated.View
        style={{
          width: 16,
          height: 16,
          backgroundColor: isOn ? '#ED7101' : '#D3D3D3',
          borderRadius: 8,
          transform: [{ translateX: moveSwitchToggle }],
        }}
      />
    </Pressable>
  );
};

export default CustomToggle;
