import { APP_NAME } from '../constants/app';

const API_TOKEN = `${APP_NAME}/apiToken`

/** API TOKEN **/
export function setTokenLocalStorage(data: string) {
  const item = JSON.stringify(data);
  localStorage.setItem(API_TOKEN, item);
}

export function getTokenLocalStorage(): string | null {
  const item = localStorage.getItem(API_TOKEN);
  if(item === null || item === undefined) return null;
  return JSON.parse(item);
}

export function clearTokenLocalStorage() {
  localStorage.removeItem(API_TOKEN);
}
