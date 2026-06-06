import 'i18next';
import ko from '../locales/ko/translation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof ko;
    };
  }
}
