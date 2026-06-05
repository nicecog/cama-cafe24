import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';

import { Inter400Text } from '@/components/Texts/InterText';
import { koreanTextInputProps } from '@/utils/textInputProps';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
  onPressAction?: () => void;
  actionLabel?: string;
  actionLoading?: boolean;
  /** 이름·병원 검색 등 한글 입력 필드 */
  koreanInput?: boolean;
}

const AuthTextField: React.FC<Props> = ({
  label,
  error,
  onPressAction,
  actionLabel,
  actionLoading,
  koreanInput,
  ...inputProps
}) => (
  <View style={styles.wrap}>
    <Inter400Text style={styles.label}>{label}</Inter400Text>
    <View style={styles.row}>
      <TextInput
        placeholderTextColor="#B6BDC3"
        style={[styles.input, error ? styles.inputError : null]}
        {...inputProps}
        {...(koreanInput ? koreanTextInputProps : null)}
      />
      {onPressAction && actionLabel ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onPressAction}
          disabled={actionLoading}
        >
          <Inter400Text style={styles.actionText}>
            {actionLoading ? '...' : actionLabel}
          </Inter400Text>
        </TouchableOpacity>
      ) : null}
    </View>
    {error ? <Inter400Text style={styles.error}>{error}</Inter400Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E8EB',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#FFF',
  },
  inputError: { borderColor: '#E53935' },
  actionBtn: {
    marginLeft: 8,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: { fontSize: 13, color: '#ED7101' },
  error: { marginTop: 6, fontSize: 12, color: '#E53935' },
});

export default AuthTextField;
