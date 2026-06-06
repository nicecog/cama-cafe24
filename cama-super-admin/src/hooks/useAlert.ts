import { useCallback } from "react";
import Swal, { SweetAlertOptions } from "sweetalert2";

type AlertOptions = SweetAlertOptions | string;

const defaultOptions = {
  allowEscapeKey: false,
  allowOutsideClick: false,
  allowEnterKey: false,
  confirmButtonColor: "#FE8825",
};

// Classes
const customClass = {
  container: "",
  popup: "",
  title: "",
  closeButton: "",
  icon: "",
  image: "",
  htmlContainer: "",
  input: "",
  inputLabel: "",
  validationMessage: "",
  actions: "",
  confirmButton: "focus:outline-none focus:ring-0",
  cancelButton: "focus:outline-none focus:ring-0",
  denyButton: "",
  loader: "",
  footer: "",
  timerProgressBar: "",
};

const useAlert = () => {
  // Alert
  const alert = useCallback((options: AlertOptions, callback?: () => void) => {
    if (typeof options === "string") {
      Swal.fire({
        ...defaultOptions,
        text: options,
      }).then((result: any) => {
        if (result.isConfirmed) {
          callback && callback();
        }
      });
    } else {
      Swal.fire({ ...defaultOptions, ...options }).then((result) => {
        if (result.isConfirmed) {
          callback && callback();
        }
      });
    }
  }, []);

  // Confirm
  const confirm = useCallback(
    (options: AlertOptions, callback?: () => void) => {
      const commonOptions: SweetAlertOptions = {
        ...defaultOptions,
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        customClass,
      };

      const swalOptions: SweetAlertOptions =
        typeof options === "string"
          ? { ...commonOptions, text: options }
          : ({ ...commonOptions, ...options } as SweetAlertOptions);

      Swal.fire(swalOptions).then((result) => {
        if (result.isConfirmed) {
          callback && callback();
        }
      });
    },
    []
  );

  const denyConfirm = (
    options: any,
    onConfirm: () => void,
    onDeny: () => void,
    onCancel?: () => void
  ) => {
    Swal.fire({
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      showDenyButton: true,
      denyButtonText: `오늘은 그만 할게요`,
      confirmButtonColor: "#FE8825",
      ...options,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm && onConfirm();
      } else if (result.isDenied) {
        onDeny && onDeny();
      } else {
        onCancel && onCancel();
      }
    });
  };

  return { alert, confirm, denyConfirm };
};

export default useAlert;
