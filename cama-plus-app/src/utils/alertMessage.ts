import { Alert } from 'react-native';

interface AlertMessage {
  title?: string;
  message?: string;
  onPress?: () => void;
}

interface CustomConfirmMessage {
  title?: string;
  doneLabel?: string;
  cancelLabel?: string;
  message?: string;
  onPressDone?: () => void;
  onPressCancel?: () => void;
}

export const showAlertMessage = ({
  title = '',
  message = '',
  onPress = () => {},
}: AlertMessage) => {
  Alert.alert(title, message, [{ text: '확인', onPress: onPress }]);
};

export const showConfirmMessage = ({
  title = '',
  message = '',
  onPress = () => {},
}: AlertMessage) => {
  Alert.alert(title, message, [
    { text: '취소' },
    { text: '확인', onPress: onPress },
  ]);
};

export const showCustomConfirmMessage = ({
  title = '',
  doneLabel = '예',
  cancelLabel = '아니오',
  message = '',
  onPressDone = () => {},
  onPressCancel = () => {},
}: CustomConfirmMessage) => {
  Alert.alert(title, message, [
    { text: cancelLabel, onPress: onPressCancel },
    { text: doneLabel, onPress: onPressDone },
  ]);
};
