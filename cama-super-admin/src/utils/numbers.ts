export const jhComma = function (inputNumber: number | string | null) {
  if (inputNumber === null) {
    return 0;
  }
  if (isNaN(Number(inputNumber))) {
    return 0;
  }
  return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatPhoneNum = (phone?: string | null) =>
  phone ? phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) : '-';

export const timeParser = (value: number) => {
  return `${value}`.padStart(2, '0');
  // if (value < 10) return `0${value}`;
  // return `${value}`;
}
