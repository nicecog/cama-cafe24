import React from 'react';
import { RecoilRoot } from 'recoil';
import AppNavigation from '@/navigations';
import { StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function App() {
  return (
    <RecoilRoot>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <AppNavigation />
      </SafeAreaView>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
