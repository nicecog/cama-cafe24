import { useState } from 'react';

interface AlertState {
  alertFlag: boolean;
  alertTitle: string;
  alertCallback?: () => void,
  confirmFlag: boolean;
  confirmTitle: string;
  confirmCallback?: () => void;
}

function useAlertState() {
  const [alertState, setAlertState] = useState<AlertState>({
    alertFlag: false,
    alertTitle: '',
    alertCallback: () => {},
    confirmFlag: false,
    confirmTitle: '',
    confirmCallback: () => {}
  })

  const onShowAlert = (title='', cb?: () => void) => {
    setAlertState(prev => ({
      ...prev,
      alertFlag: true,
      alertTitle: title,
      alertCallback: cb || (() => {})
    }))
  }

  const onCloseAlert = () => {
    const { alertCallback } = alertState
    setAlertState(prev => ({
      ...prev,
      alertFlag: false,
      alertTitle: '',
      alertCallback: () => {}
    }))

    setTimeout(() => {
      alertCallback && alertCallback()
    }, 300)
  }

  const onShowConfirm = (title='', cb?: () => void) => {
    setAlertState(prev => ({
      ...prev,
      confirmFlag: true,
      confirmTitle: title,
      confirmCallback: cb || (() => {})
    }))
  }

  const onConfirmDone = () => {
    const { confirmCallback } = alertState
    setAlertState(prev => ({
      ...prev,
      confirmFlag: false,
      confirmTitle: '',
      confirmCallback: () => {}
    }))

    setTimeout(() => {
      confirmCallback && confirmCallback()
    }, 300)
  }

  const onConfirmCancel = () => {
    setAlertState(prev => ({
      ...prev,
      confirmFlag: false,
      confirmTitle: '',
      confirmCallback: () => {}
    }))
  }

  return {
    alertState,
    onShowAlert,
    onCloseAlert,
    onShowConfirm,
    onConfirmDone,
    onConfirmCancel,
  }
}

export default useAlertState;
