import React from 'react';
import { ActivityIndicator, ColorValue, View } from 'react-native';

interface FullScreenLoaderProps {
  color?: ColorValue;
  size?: number | 'small' | 'large' | undefined;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  color = '#000000',
  size = 'large',
}) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <ActivityIndicator color={color} size={size} />
    </View>
  );
};

export default FullScreenLoader
