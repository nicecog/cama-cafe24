import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
  modalFlag: boolean;
  onCloseModal: () => void;
  children: ReactNode;
}

const ModalScrollable: React.FC<Props> = ({
  modalFlag,
  onCloseModal,
  children,
}) => {
  return (
    <Modal
      isVisible={modalFlag}
      onBackdropPress={onCloseModal} // Background press
      onBackButtonPress={onCloseModal} // Android back press
      animationIn="slideInUp" // Has others, we want slide in from the left
      animationOut="slideOutDown" // When discarding the drawer
      // swipeDirection="left" // Discard the drawer with swipe to left
      // swipeDirection={['up', 'down']}
      useNativeDriver // Faster animation
      hideModalContentWhileAnimating // Better performance, try with/without
      propagateSwipe={true} // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
      style={styles.bottomHalfStyle} // Needs to contain the width, 75% of screen width in our case
    >
      {children}
    </Modal>
  );
};

export default ModalScrollable;

const styles = StyleSheet.create({
  bottomHalfStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
