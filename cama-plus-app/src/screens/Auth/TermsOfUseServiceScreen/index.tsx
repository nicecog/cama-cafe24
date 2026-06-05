import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

import { AuthNavigationScreenProps } from '@/navigations/AuthNavigation';

import LeftBackTitleHeader from '@/components/Headers/LeftBackTitleHeader';
import FullScreenLoader from '@/components/Loaders/FullscrennLoader';

const TermsOfUseServiceScreen: React.FC<
  AuthNavigationScreenProps<'TermsOfUseServiceScreen'>
> = ({
  route: {
    params: { title, uri },
  },
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <LeftBackTitleHeader title={title} />
      {loading && <FullScreenLoader />}
      <View style={{ position: 'relative', flex: 1, backgroundColor: 'pink' }}>
        <WebView source={{ uri: uri }} onLoad={() => setLoading(false)} />
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: 160,
          }}
        />
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 140,
            height: 70,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default TermsOfUseServiceScreen;
