import { FloatInput } from "@/components/forms";
import { useNavigate } from "react-router-dom";
import { FormEvent, useEffect } from "react";
import { HiLockClosed, HiMiniUserCircle } from "react-icons/hi2";
import useAuth from "@/hooks/useAuth";
import useAlert from "@/hooks/useAlert";
import { useTranslation } from "react-i18next";
 

// 로그인 페이지
export default function LoginPage() {
  // Auth
  const { login, isAuthLogin } = useAuth();
  // Alert
  const { alert } = useAlert();
  // Translation
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  // Navi
  const navigate = useNavigate();
  // 로그인 되어 있을 경우는 메인으로 이동
  useEffect(() => {
    if (isAuthLogin()) {
      navigate(import.meta.env.VITE_DEFAULT_PAGE);
    }
  }, []);

  //  Change language
  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };


  // Form Submit Event
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form Data 가져오기
    const formData = new FormData(e.currentTarget);
    // 데이터 Trim()
    const userId = formData.get("userId")?.toString().trim() || null;
    const password = formData.get("password")?.toString().trim() || null;

    // Validation 체크
    if (!userId) {
      alert(t("common.idRequired"));
      return;
    }
    if (!password) {
      alert(t("common.passwordRequired"));
      return;
    }

    const { isLogin, message } = await login(userId, password);

    if (!isLogin) {
      alert(message);
    } else {
      navigate(import.meta.env.VITE_DEFAULT_PAGE);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 opacity-75"></div>
        <div className="absolute top-1/3 left-1/3  animate-blob w-80 h-80 bg-green-500 rounded-full z-10 opacity-30"></div>
      </div>

      {/* Login Form */}
      <div className="max-w-md w-full space-y-8 relative z-10 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <svg
            fill="#388E3C" // 강조된 녹색 색상으로 변경
            className="mx-auto h-12 w-auto"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 201.324 201.324"
            role="img"
            aria-label="CAMA+ Logo"
          >
            <title>CAMA+ Logo</title>
            <circle cx="95.596" cy="10.083" r="10.083" />
            <circle cx="149.018" cy="10.083" r="10.083" />
            <path
              d="M179.06,19.254c-5.123-8.873-14.298-14.17-24.544-14.17v10c6.631,0,12.568,3.428,15.884,9.17
	c3.316,5.743,3.316,12.599,0.001,18.342l-32.122,55.636c-3.315,5.742-9.253,9.17-15.884,9.171c-6.631,0-12.569-3.428-15.885-9.171
	L74.389,42.595c-3.315-5.742-3.315-12.599,0-18.341s9.254-9.171,15.885-9.171v-10c-10.246,0-19.422,5.297-24.545,14.171
	s-5.123,19.468,0,28.341l32.121,55.636c4.272,7.399,11.366,12.299,19.545,13.727v26.832c0,26.211-15.473,47.535-34.492,47.535
	c-19.019,0-34.491-21.324-34.491-47.535v-31.948C59.802,109.52,68.4,99.424,68.4,87.356c0-13.779-11.21-24.989-24.989-24.989
	s-24.989,11.21-24.989,24.989c0,12.067,8.598,22.163,19.989,24.486v31.948c0,31.725,19.959,57.535,44.492,57.535
	c24.532,0,44.491-25.81,44.491-57.535v-26.832c8.178-1.428,15.273-6.328,19.544-13.727l32.122-55.636
	C184.184,38.722,184.184,28.127,179.06,19.254z"
            />
          </svg>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("common.welcomeText")}
          </h2>
          
          <div className="flex justify-center mt-4 gap-3">
            <button
              type="button"
              onClick={() => setLanguage("KO")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                i18n.language === "KO"
                  ? "bg-green-600 border-green-600 text-white shadow-md active:scale-95"
                  : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600"
              }`}
            >
              한국어
            </button>
            <div className="w-[1px] h-4 bg-gray-300 self-center"></div>
            <button
              type="button"
              onClick={() => setLanguage("US")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                i18n.language === "US"
                  ? "bg-green-600 border-green-600 text-white shadow-md active:scale-95"
                  : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600"
              }`}
            >
              English [개발진행중]
            </button>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FloatInput
            name="userId"
            type="text"
            icon={<HiMiniUserCircle />}
            placeholder="User ID"
          />
          <FloatInput
            name="password"
            type="password"
            icon={<HiLockClosed />}
            placeholder="Password"
          />
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {t("common.login")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
