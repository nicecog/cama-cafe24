export const convertImageToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    let baseUrl = '';

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (reader.result) baseUrl = reader.result.toString();
      resolve(baseUrl);
    };

    reader.onerror = () => {
      reject(new Error('Base64로 변환 중 에러 발생'));
    };
  });

export const encodeFileToBase64 = (file: File) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result);
    };
  });
}
