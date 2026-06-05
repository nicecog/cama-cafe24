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
import { usePatientSession } from '@/hooks/auth/usePatientSession';
import { generateFirebaseInfo } from '@/utils/infos';
import { showAlertMessage } from '@/utils/alertMessage';
import {
  normalizePhone,
  validateOptionalEmail,
  validateLoginId,
  validateName,
  validatePassword,
  validatePasswordConfirm,
  validatePhone,
} from '@/utils/patientAuthValidation';
import { asciiTextInputProps } from '@/utils/textInputProps';

type FieldErrors = Record<string, string | null>;

const SignUpPatientScreen: React.FC<
  AuthNavigationScreenProps<'SignUpPatientScreen'>
> = () => {
  const { completePatientLogin } = usePatientSession();
  const [form, setForm] = useState({
    loginId: '',
    password: '',
    passwordConfirm: '',
    email: '',
    name: '',
    phone: '',
    patientManagementNumber: '',
    birthday: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: null }));
  };

  const runDuplicateCheck = async (
    key: 'loginId' | 'email' | 'phone' | 'patientManagementNumber',
  ) => {
    setChecking(key);
    try {
      let resp;
      if (key === 'loginId') {
        const err = validateLoginId(form.loginId);
        if (err) {
          setErrors(prev => ({ ...prev, loginId: err }));
          return;
        }
        resp = await patientAuthApi.checkLoginId({ loginId: form.loginId.trim() });
      } else if (key === 'email') {
        if (!form.email.trim()) {
          showAlertMessage({ message: '중복 확인할 이메일을 입력해 주세요.' });
          return;
        }
        const err = validateOptionalEmail(form.email);
        if (err) {
          setErrors(prev => ({ ...prev, email: err }));
          return;
        }
        resp = await patientAuthApi.checkEmail({ email: form.email.trim() });
      } else if (key === 'phone') {
        const err = validatePhone(form.phone);
        if (err) {
          setErrors(prev => ({ ...prev, phone: err }));
          return;
        }
        resp = await patientAuthApi.checkPhone({ phone: form.phone.trim() });
      } else {
        if (!form.patientManagementNumber.trim()) {
          return;
        }
        resp = await patientAuthApi.checkPatientNumber({
          patientManagementNumber: form.patientManagementNumber.trim(),
        });
      }
      showAlertMessage({
        title: resp.available ? '사용 가능' : '사용 불가',
        message: resp.message,
      });
      if (!resp.available) {
        setErrors(prev => ({ ...prev, [key]: resp.message }));
      }
    } catch (err) {
      showAlertMessage({ message: String(err) });
    } finally {
      setChecking(null);
    }
  };

  const validateAll = () => {
    const next: FieldErrors = {
      loginId: validateLoginId(form.loginId),
      password: validatePassword(form.password),
      passwordConfirm: validatePasswordConfirm(form.password, form.passwordConfirm),
      email: validateOptionalEmail(form.email),
      name: validateName(form.name),
      phone: validatePhone(form.phone),
    };
    setErrors(next);
    return Object.values(next).every(v => !v);
  };

  const onSubmit = async () => {
    if (!validateAll()) {
      return;
    }

    setLoading(true);
    try {
      const firebase = await generateFirebaseInfo();
      await patientAuthApi.register({
        loginId: form.loginId.trim(),
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        email: form.email.trim() || undefined,
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
        patientManagementNumber: form.patientManagementNumber.trim() || undefined,
        birthday: form.birthday.trim() || undefined,
        firebase,
        lang: 'KO',
      });
      showAlertMessage({
        title: '회원가입 완료',
        message: '가입이 완료되었습니다. 로그인합니다.',
      });
      await completePatientLogin(form.loginId, form.password);
    } catch (err) {
      showAlertMessage({
        title: '회원가입 실패',
        message: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LeftBackHeader title="회원가입" />
      {loading && <FullScreenLoader />}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AuthTextField
            label="아이디 *"
            value={form.loginId}
            onChangeText={v => update('loginId', v.replace(/[^a-zA-Z0-9]/g, ''))}
            {...asciiTextInputProps}
            error={errors.loginId}
            placeholder="영문/숫자 4~20자"
            actionLabel="중복확인"
            actionLoading={checking === 'loginId'}
            onPressAction={() => runDuplicateCheck('loginId')}
          />
          <AuthTextField
            label="비밀번호 *"
            value={form.password}
            onChangeText={v => update('password', v)}
            secureTextEntry
            error={errors.password}
            placeholder="8~12자, 영문/숫자/특수문자"
          />
          <AuthTextField
            label="비밀번호 확인 *"
            value={form.passwordConfirm}
            onChangeText={v => update('passwordConfirm', v)}
            secureTextEntry
            error={errors.passwordConfirm}
            placeholder="비밀번호 재입력"
          />
          <AuthTextField
            label="이메일 (선택)"
            value={form.email}
            onChangeText={v => update('email', v)}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
            placeholder="example@email.com (선택)"
            actionLabel="중복확인"
            actionLoading={checking === 'email'}
            onPressAction={() => runDuplicateCheck('email')}
          />
          <AuthTextField
            label="이름 *"
            value={form.name}
            onChangeText={v => update('name', v)}
            koreanInput
            error={errors.name}
            placeholder="이름 (한글 가능)"
          />
          <AuthTextField
            label="전화번호 *"
            value={form.phone}
            onChangeText={v => update('phone', v)}
            keyboardType="phone-pad"
            error={errors.phone}
            placeholder="01012345678"
            actionLabel="중복확인"
            actionLoading={checking === 'phone'}
            onPressAction={() => runDuplicateCheck('phone')}
          />
          <AuthTextField
            label="환자번호 (선택)"
            value={form.patientManagementNumber}
            onChangeText={v => update('patientManagementNumber', v)}
            error={errors.patientManagementNumber}
            placeholder="병원 환자번호"
            actionLabel="중복확인"
            actionLoading={checking === 'patientManagementNumber'}
            onPressAction={() => runDuplicateCheck('patientManagementNumber')}
          />
          <AuthTextField
            label="생년월일 (선택)"
            value={form.birthday}
            onChangeText={v => update('birthday', v)}
            placeholder="YYYY-MM-DD"
          />
          <TouchableOpacity
            onPress={onSubmit}
            style={[styles.primaryBtn, viewStyles.rowAiCenterJcCenter]}
          >
            <Inter700Text style={styles.primaryBtnText}>저장</Inter700Text>
          </TouchableOpacity>
          <Inter400Text style={styles.hint}>
            * 표시는 필수 입력 항목입니다.
          </Inter400Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 20, paddingBottom: 48 },
  primaryBtn: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#ED7101',
    marginTop: 8,
  },
  primaryBtnText: { fontSize: 18, color: '#FFF' },
  hint: { marginTop: 12, fontSize: 12, color: '#888', textAlign: 'center' },
});

export default SignUpPatientScreen;
