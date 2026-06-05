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
import patientAuthApi from '@/services/apis/patientAuth';
import { showAlertMessage } from '@/utils/alertMessage';
import {
  normalizePhone,
  validateLoginId,
  validateName,
  validatePhone,
} from '@/utils/patientAuthValidation';
import { asciiTextInputProps } from '@/utils/textInputProps';

type Tab = 'id' | 'password';

const FindAccountScreen: React.FC<
  AuthNavigationScreenProps<'FindAccountScreen'>
> = () => {
  const [tab, setTab] = useState<Tab>('id');
  const [loading, setLoading] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const onFindId = async () => {
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    if (nameErr || phoneErr) {
      showAlertMessage({ message: nameErr || phoneErr || '' });
      return;
    }

    setLoading(true);
    try {
      const resp = await patientAuthApi.findLoginId({
        name: name.trim(),
        phone: normalizePhone(phone),
      });
      if (resp.found && resp.loginId) {
        showAlertMessage({
          title: '아이디 찾기',
          message: `회원 아이디: ${resp.loginId}`,
        });
      } else {
        showAlertMessage({ title: '아이디 찾기', message: resp.message });
      }
    } catch (err) {
      showAlertMessage({ message: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {
    const loginIdErr = validateLoginId(loginId);
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    if (loginIdErr || nameErr || phoneErr) {
      showAlertMessage({ message: loginIdErr || nameErr || phoneErr || '' });
      return;
    }

    setLoading(true);
    try {
      const resp = await patientAuthApi.resetPassword({
        loginId: loginId.trim(),
        name: name.trim(),
        phone: normalizePhone(phone),
      });
      if (resp.reset && resp.temporaryPassword) {
        showAlertMessage({
          title: '비밀번호 초기화',
          message: `${resp.message}\n\n임시 비밀번호: ${resp.temporaryPassword}\n\n※ 새로 발급된 임시 비밀번호만 사용할 수 있습니다. 이전에 받은 임시 비밀번호는 더 이상 사용할 수 없습니다.`,
        });
      } else {
        showAlertMessage({ title: '비밀번호 초기화', message: resp.message });
      }
    } catch (err) {
      showAlertMessage({ message: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LeftBackHeader title="ID/PW 찾기" />
      {loading && <FullScreenLoader />}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'id' && styles.tabActive]}
          onPress={() => setTab('id')}
        >
          <Inter700Text style={[styles.tabText, tab === 'id' && styles.tabTextActive]}>
            ID 찾기
          </Inter700Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'password' && styles.tabActive]}
          onPress={() => setTab('password')}
        >
          <Inter700Text
            style={[styles.tabText, tab === 'password' && styles.tabTextActive]}
          >
            PW 초기화
          </Inter700Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Inter400Text style={styles.desc}>
            {tab === 'id'
              ? '가입 시 등록한 이름과 전화번호로 아이디를 찾습니다.'
              : '아이디, 이름, 전화번호가 일치하면 임시 비밀번호를 발급합니다. 로그인 후 비밀번호를 변경해 주세요.'}
          </Inter400Text>
          {tab === 'password' && (
            <AuthTextField
              label="아이디"
              value={loginId}
              onChangeText={setLoginId}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="아이디 입력"
              {...asciiTextInputProps}
            />
          )}
          <AuthTextField
            label="이름"
            value={name}
            onChangeText={setName}
            koreanInput
            placeholder="이름 (한글 가능)"
          />
          <AuthTextField
            label="전화번호"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="01012345678"
          />
          <TouchableOpacity
            onPress={tab === 'id' ? onFindId : onResetPassword}
            style={[styles.primaryBtn, viewStyles.rowAiCenterJcCenter]}
          >
            <Inter700Text style={styles.primaryBtnText}>
              {tab === 'id' ? '아이디 찾기' : '비밀번호 초기화'}
            </Inter700Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 12 },
  tab: {
    flex: 1,
    height: 44,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E8EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: { borderBottomColor: '#ED7101' },
  tabText: { fontSize: 16, color: '#888' },
  tabTextActive: { color: '#ED7101' },
  content: { padding: 20, paddingBottom: 40 },
  desc: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
  primaryBtn: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#ED7101',
    marginTop: 8,
  },
  primaryBtnText: { fontSize: 18, color: '#FFF' },
});

export default FindAccountScreen;
