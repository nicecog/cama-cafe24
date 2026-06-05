import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import GP_SPLASH_SCREEN from '@/assets/icons/logo/gp_splash_screen.svg';

const CustomSplashScreen = () => {
  return (
    <LinearGradient
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backgroundColor: 'pink',
      }}
      colors={['rgba(235, 86, 20, 1)', 'rgba(238, 166, 64, 1)']}
    >
      <GP_SPLASH_SCREEN />
    </LinearGradient>
  );
};

export default CustomSplashScreen;
