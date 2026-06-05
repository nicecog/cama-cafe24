export const jhComma = function (inputNumber: number | string | null) {
  if (inputNumber === null || isNaN(Number(inputNumber))) {
    return '0';
  }
  return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const timeParser = (value: number | string) => {
  return `${value}`.padStart(2, '0');
};
