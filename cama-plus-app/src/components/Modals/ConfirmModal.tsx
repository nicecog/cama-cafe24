import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import ModalScrollable from '@/components/Modals/ModalScrollable';
import RectRoundButton from '@/components/Buttons/RectRoundButton2';

import { Inter400Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';

interface Props {
  showModal: boolean;
  doneLabel?: string;
  cancelLabel?: string;
  onPressDone: () => void;
  onPressCancel: () => void;
  children: ReactNode;
}

const ConfirmModal: React.FC<Props> = ({
  showModal,
  doneLabel = '네',
  cancelLabel = '아니요',
  onPressDone,
  onPressCancel,
  children,
}) => {
  return (
    <ModalScrollable modalFlag={showModal} onCloseModal={onPressDone}>
      <SafeAreaView style={styles.modalSafeArea}>
        <View style={styles.modalWrap}>
          {children}
          <View style={[styles.buttonSection, viewStyles.rowAiCenter]}>
            <RectRoundButton
              buttonStyle={{
                flex: 1,
                backgroundColor: '#A6A6A6',
                borderBottomLeftRadius: 26,
              }}
              label={doneLabel}
              onPress={onPressDone}
            />
            <RectRoundButton
              shadow={false}
              buttonStyle={{
                flex: 1,
                backgroundColor: '#ED7101',
                borderBottomRightRadius: 26,
              }}
              label={cancelLabel}
              onPress={onPressCancel}
            />
          </View>
        </View>
      </SafeAreaView>
    </ModalScrollable>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrap: {
    backgroundColor: '#fff',
    width: '80%',
    // height: 282,
    padding: 24,
    paddingBottom: 76,
    borderRadius: 26,
  },
  buttonSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
