import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { AuthNavigationScreenProps } from '@/navigations/AuthNavigation';
import LeftBackHeader from '@/components/Headers/LeftBackHeader';
import AuthTextField from '@/components/Auth/AuthTextField';
import FullScreenLoader from '@/components/Loaders/FullscrennLoader';
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles } from '@/components/_StyleSheets';
import { usePatientSession } from '@/hooks/auth/usePatientSession';
import { validateLoginId } from '@/utils/patientAuthValidation';

const LoginCredentialsScreen: React.FC<
  AuthNavigationScreenProps<'LoginCredentialsScreen'>
> = ({ navigation: { navigate } }) => {
  const { completePatientLogin, handleLoginError } = usePatientSession();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginIdError, setLoginIdError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    const idErr = validateLoginId(loginId);
    setLoginIdError(idErr);
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해 주세요.');
    } else {
      setPasswordError(null);
    }
    if (idErr || !password.trim()) {
      return;
    }

    setLoading(true);
    try {
      await completePatientLogin(loginId, password);
    } catch (err) {
      handleLoginError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LeftBackHeader title="로그인" />
      {loading && <FullScreenLoader />}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Inter700Text style={styles.title}>아이디 / 비밀번호 로그인</Inter700Text>
          <AuthTextField
            label="아이디"
            value={loginId}
            onChangeText={v => {
              setLoginId(v);
              setLoginIdError(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            error={loginIdError}
            placeholder="아이디 입력"
          />
          <AuthTextField
            label="비밀번호"
            value={password}
            onChangeText={v => {
              setPassword(v);
              setPasswordError(null);
            }}
            secureTextEntry
            error={passwordError}
            placeholder="비밀번호 입력"
          />
          <TouchableOpacity
            onPress={onLogin}
            style={[styles.primaryBtn, viewStyles.rowAiCenterJcCenter]}
          >
            <Inter700Text style={styles.primaryBtnText}>로그인</Inter700Text>
          </TouchableOpacity>
          <View style={styles.linkRow}>
            <TouchableOpacity onPress={() => navigate('SignUpPatientScreen')}>
              <Inter400Text style={styles.link}>회원가입</Inter400Text>
            </TouchableOpacity>
            <Inter400Text style={styles.divider}>|</Inter400Text>
            <TouchableOpacity onPress={() => navigate('FindAccountScreen')}>
              <Inter400Text style={styles.link}>ID/PW 찾기</Inter400Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, color: '#111', marginBottom: 24 },
  primaryBtn: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#ED7101',
    marginTop: 8,
  },
  primaryBtnText: { fontSize: 18, color: '#FFF' },
  linkRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: { fontSize: 15, color: '#ED7101' },
  divider: { marginHorizontal: 12, color: '#CCC' },
});

export default LoginCredentialsScreen;
