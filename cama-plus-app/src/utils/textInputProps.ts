import { Platform, TextInputProps } from 'react-native';

/** Android에서 한글 IME가 뜨도록 autofill/키보드 제한을 해제합니다. */
export const koreanTextInputProps: TextInputProps = Platform.select({
  android: {
    keyboardType: 'default',
    autoCapitalize: 'none',
    autoCorrect: true,
    autoComplete: 'off',
    importantForAutofill: 'no',
  },
  ios: {
    keyboardType: 'default',
    autoCapitalize: 'none',
    autoCorrect: true,
    textContentType: 'none',
  },
  default: {
    keyboardType: 'default',
    autoCapitalize: 'none',
  },
})!;

/** 아이디 등 ASCII 전용 필드 */
export const asciiTextInputProps: TextInputProps = Platform.select({
  android: {
    keyboardType: 'default',
    autoCapitalize: 'none',
    autoComplete: 'off',
    importantForAutofill: 'no',
  },
  ios: {
    keyboardType: 'ascii-capable',
    autoCapitalize: 'none',
    autoComplete: 'off',
    textContentType: 'username',
  },
  default: {
    keyboardType: 'default',
    autoCapitalize: 'none',
  },
})!;
