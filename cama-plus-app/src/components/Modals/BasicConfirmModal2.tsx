import React, { ReactNode } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import ModalScrollable from '@/components/Modals/ModalScrollable';
import RectRoundButton from '@/components/Buttons/RectRoundButton';

import { Inter400Text } from '@/components/Texts/InterText';

interface BasicConfirmModalProps {
  showPicker: boolean;
  title: string;
  itemCount?: number;
  leftLabel?: string;
  rightLabel?: string;
  onCloseModal: () => void;
  onPressLeft: () => void;
  onPressRight: () => void;
  modalStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const BasicConfirmModal2: React.FC<BasicConfirmModalProps> = ({
  showPicker,
  title,
  itemCount = 0,
  leftLabel = '취소',
  rightLabel = '저장',
  onCloseModal,
  onPressLeft,
  onPressRight,
  modalStyle = {},
  buttonStyle = {},
  children,
}) => {
  return (
    <ModalScrollable modalFlag={showPicker} onCloseModal={onCloseModal}>
      <SafeAreaView style={styles.modalSafeArea}>
        <View
          style={[
            styles.modalWrap,
            { height: 135 + 45 * itemCount },
            modalStyle,
          ]}
        >
          <Inter400Text style={styles.modalTitle}>{title}</Inter400Text>
          {children}
          <View style={[styles.modalButtonView, buttonStyle]}>
            <RectRoundButton
              label={leftLabel}
              onPress={onPressLeft}
              buttonStyle={{
                backgroundColor: '#FFF',
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#DDDDDD',
                marginRight: 10,
                flex: 1,
              }}
              textStyle={{ color: '#666666' }}
            />
            <RectRoundButton
              label={rightLabel}
              onPress={onPressRight}
              buttonStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </SafeAreaView>
    </ModalScrollable>
  );
};

export default BasicConfirmModal2;

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrap: {
    backgroundColor: '#fff',
    width: '80%',
    height: 230,
    maxHeight: 380,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  modalTitle: {
    paddingVertical: 14,
    textAlign: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalButtonView: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 20,
  },
});
