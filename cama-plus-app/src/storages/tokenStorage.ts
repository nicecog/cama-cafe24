import EncryptedStorage from 'react-native-encrypted-storage';

const ACCESS_TOKEN = 'ACCESS_TOKEN';

export const getTokenEncryptedStorage = async () => {
  return await EncryptedStorage.getItem(ACCESS_TOKEN);
};

export const setTokenEncryptedStorage = async (value: string) => {
  return await EncryptedStorage.setItem(ACCESS_TOKEN, value);
};

export const removeTokenEncryptedStorage = async () => {
  return await EncryptedStorage.removeItem(ACCESS_TOKEN);
};
