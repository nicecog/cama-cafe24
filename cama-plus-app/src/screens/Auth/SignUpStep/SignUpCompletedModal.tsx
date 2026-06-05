import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import ModalScrollable from '@/components/Modals/ModalScrollable';
import RectRoundButton from '@/components/Buttons/RectRoundButton';

import { Inter400Text } from '@/components/Texts/InterText';

interface Props {
  showPicker: boolean;
  onPressDone: () => void;
}

const SignUpCompletedModal: React.FC<Props> = ({ showPicker, onPressDone }) => {
  return (
    <ModalScrollable modalFlag={showPicker} onCloseModal={onPressDone}>
      <SafeAreaView style={styles.modalSafeArea}>
        <View style={styles.modalWrap}>
          <Inter400Text style={styles.msgLabel}>
            가입 신청이 완료되었습니다.
          </Inter400Text>
          <Inter400Text style={styles.msgLabel}>
            승인이 되기 전까지 일부 기능을 체험할 수 있습니다.
          </Inter400Text>
          <Inter400Text style={styles.msgLabel}>
            가입이 승인되면 암정보 가이드 서비스를 이용할 수 있습니다.
          </Inter400Text>
          <View style={styles.buttonSection}>
            <RectRoundButton
              label={'메인페이지로 이동'}
              onPress={onPressDone}
            />
          </View>
        </View>
      </SafeAreaView>
    </ModalScrollable>
  );
};

export default SignUpCompletedModal;

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrap: {
    backgroundColor: '#fff',
    width: '80%',
    height: 282,
    padding: 24,
  },
  msgLabel: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  buttonSection: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
  },
});
