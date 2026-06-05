import React, { Fragment } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { AuthNavigationScreenProps } from '@/navigations/AuthNavigation';
import PolicyView from '@/screens/MyPage/UserInfo/PolicyView';
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles } from '@/components/_StyleSheets';

const LoginScreen: React.FC<AuthNavigationScreenProps<'LoginScreen'>> = ({
  navigation: { navigate },
}) => (
  <SafeAreaView style={{ position: 'relative', flex: 1 }}>
    <Fragment>
      <View style={{ marginTop: 180, paddingHorizontal: 16 }}>
        <Inter400Text style={{ fontSize: 36, color: '#000' }}>
          안녕하세요
        </Inter400Text>
        <Inter700Text style={{ fontSize: 36, color: '#000' }}>
          CAMA입니다
        </Inter700Text>
      </View>
      <View style={styles.policySection}>
        <PolicyView
          onPressPrivacy={() => {
            navigate('TermsOfUseServiceScreen', {
              title: '개인정보 처리방침',
              uri: 'https://upbeat-vicuna-052.notion.site/941c4b7999e54b89be027218ca60ca99?pvs=4',
            });
          }}
          onPressTerms={() => {
            navigate('TermsOfUseServiceScreen', {
              title: '서비스 이용약관',
              uri: 'https://upbeat-vicuna-052.notion.site/c62f5d4eb76442f99868f7c3434e20d7?pvs=4',
            });
          }}
        />
      </View>
      <View style={styles.buttonSection}>
        <TouchableOpacity
          onPress={() => navigate('LoginCredentialsScreen')}
          style={[
            {
              height: 52,
              borderRadius: 8,
              backgroundColor: '#ED7101',
            },
            viewStyles.rowAiCenterJcCenter,
            styles.shadow2,
          ]}
        >
          <Inter700Text style={{ fontSize: 20, color: '#FFF' }}>
            로그인
          </Inter700Text>
        </TouchableOpacity>
      </View>
      <View style={styles.previewSection}>
        <TouchableOpacity
          onPress={() => navigate('PreviewScreen')}
          style={[{ height: 52 }, viewStyles.rowAiCenterJcCenter]}
        >
          <Inter400Text style={{ fontSize: 16, color: '#ED7101' }}>
            로그인 하지 않고 둘러보기
          </Inter400Text>
        </TouchableOpacity>
      </View>
    </Fragment>
  </SafeAreaView>
);

export default LoginScreen;

const styles = StyleSheet.create({
  buttonSection: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 90,
  },
  previewSection: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 30,
  },
  policySection: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 160,
  },
  shadow2: {
    shadowColor: 'rgba(237, 113, 1, 0.50)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
