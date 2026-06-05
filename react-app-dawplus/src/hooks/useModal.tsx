import { useCallback, useState } from "react";

interface UseModalOptions {
  defaultVisible?: boolean; // 초기 모달 상태
  onOpen?: () => void; // 모달 열릴 때 실행할 콜백
  onClose?: () => void; // 모달 닫힐 때 실행할 콜백
}

export function useModal({
  defaultVisible = false,
  onOpen,
  onClose,
}: UseModalOptions = {}) {
  const [visible, setVisible] = useState(defaultVisible);

  const openModal = useCallback(() => {
    setVisible(true);
    onOpen?.();
  }, [onOpen]);

  const closeModal = useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);

  const toggleModal = useCallback(() => {
    setVisible((prev) => {
      const newState = !prev;
      newState ? onOpen?.() : onClose?.();
      return newState;
    });
  }, [onOpen, onClose]);

  return { visible, openModal, closeModal, toggleModal, setVisible };
}
