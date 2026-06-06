import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * i18n 사용 예제 컴포넌트
 * useTranslation hook을 사용하여 다국어 텍스트를 표시하는 방법을 보여줍니다.
 */
const I18nExample: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md">
      <h2 className="text-2xl font-bold mb-4">{t('common.welcome')}</h2>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {t('common.login')}
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            {t('common.logout')}
          </button>
        </div>

        <div className="border-t pt-3">
          <h3 className="font-semibold mb-2">{t('navigation.dashboard')}</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>{t('navigation.home')}</li>
            <li>{t('navigation.settings')}</li>
            <li>{t('navigation.profile')}</li>
          </ul>
        </div>

        <div className="border-t pt-3">
          <p className="text-sm text-gray-600">{t('validation.required')}</p>
          <p className="text-sm text-gray-600">{t('validation.invalidEmail')}</p>
        </div>
      </div>
    </div>
  );
};

export default I18nExample;
