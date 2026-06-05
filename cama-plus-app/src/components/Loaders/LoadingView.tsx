import React from 'react';
import { View } from 'react-native';

import FullScreenLoader from '@/components/Loaders/FullscrennLoader';
import { viewStyles } from '@/components/_StyleSheets';

const LoadingView = () => {
  return (
    <View
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        viewStyles.rowAiCenterJcCenter,
      ]}
    >
      <FullScreenLoader />
    </View>
  );
};

export default LoadingView
