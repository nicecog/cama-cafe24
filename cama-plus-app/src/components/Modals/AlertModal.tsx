import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import ModalScrollable from '@/components/Modals/ModalScrollable';
import RectRoundButton from '@/components/Buttons/RectRoundButton';

import { viewStyles, borderStyles } from '@/components/_StyleSheets';

interface Props {
  showModal: boolean;
  doneLabel?: string;
  onPressDone: () => void;
  children: ReactNode;
}

const AlertModal: React.FC<Props> = ({
  showModal,
  doneLabel = '확인',
  onPressDone,
  children,
}) => {
  return (
    <ModalScrollable modalFlag={showModal} onCloseModal={onPressDone}>
      <SafeAreaView style={styles.modalSafeArea}>
        <View style={styles.modalWrap}>
          {children}
          <View
            style={[styles.buttonSection, viewStyles.rowAiCenter]}
          >
            <RectRoundButton
              buttonStyle={{
                flex: 1,
                ...borderStyles.buttonBorder,
              }}
              label={doneLabel}
              onPress={onPressDone}
            />
          </View>
        </View>
      </SafeAreaView>
    </ModalScrollable>
  );
};

export default AlertModal;

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
    borderRadius: 8,
  },
  buttonSection: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
  }
});
