import React from 'react';
import { useTranslation } from 'react-i18next';
import I18nExample from '@/components/I18nExample';

/**
 * i18n 테스트 페이지
 * 다국어 기능이 정상적으로 작동하는지 확인하기 위한 데모 페이지입니다.
 */
const I18nTestPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          🌐 다국어(i18n) 테스트 페이지
        </h2>
        <p className="text-blue-700">
          현재 언어: <strong>{i18n.language === 'ko' ? '한국어' : 'English'}</strong>
        </p>
        <p className="text-sm text-blue-600 mt-1">
          오른쪽 상단의 언어 전환 버튼을 클릭하여 언어를 변경해보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">📝 번역 예제</h3>
          <I18nExample />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">🔑 사용 가능한 번역 키</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="text-sm">
              <code className="bg-gray-200 px-2 py-1 rounded">t('common.welcome')</code>
              <span className="ml-2">→ {t('common.welcome')}</span>
            </div>
            <div className="text-sm">
              <code className="bg-gray-200 px-2 py-1 rounded">t('common.login')</code>
              <span className="ml-2">→ {t('common.login')}</span>
            </div>
            <div className="text-sm">
              <code className="bg-gray-200 px-2 py-1 rounded">t('navigation.dashboard')</code>
              <span className="ml-2">→ {t('navigation.dashboard')}</span>
            </div>
            <div className="text-sm">
              <code className="bg-gray-200 px-2 py-1 rounded">t('validation.required')</code>
              <span className="ml-2">→ {t('validation.required')}</span>
            </div>
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">✅ 사용 방법</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.login')}</button>
    </div>
  );
};`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default I18nTestPage;
