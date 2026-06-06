import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
import * as CryptoJS from "crypto-js";
import axios from "@/utils/axios";

// TODO 추가 할 정보가 있으면 추가 - 일단...다
export type SessionTokkenType = {
	createdAt: any;
	departmentSeq: any;
	hospitalSeq: any;
	lastedAt: any;
	loginId: any;
	name: any;
	nick: any;
	phone: any;
	profileImage: any;
	profileLink: any;
	seq: any;
	updatedAt: any;
};

// Cookie
const cookie = new Cookies();
// Set Cookie
export const setCookie = (name: string, value: any, options?: any) => {
	cookie.set(name, value, options);
};
// get Cookie
export const getCookie = (name: string) => {
	return cookie.get(name);
};
// Remove Cookie
export const removeCookie = (name: string) => {
	return cookie.remove(name);
};

/**
 * 로그인 관련 Hooks
 * Cookie를 사용하여 로그인관련 처리
 * Cookie 관련 Util 제공
 * TODO 실제 로그인 처리 필요함
 */

const useAuth = () => {
	// Navigation
	const navigate = useNavigate();
	// Cookie option
	// const cookieOpt = {
	//   path: "/",
	//   HttpOnly: true,
	//   secure: true, //https 에서만 전송
	//   expires: dayjs().add(30, "minute").toDate(),
	// };
	// Cookie Access Tokken
	const accessTokkenName = import.meta.env.VITE_COOKIE_ACCESS_TOKKEN;
	// Cookie User Info
	const userInfoName = import.meta.env.VITE_COOKIE_USER_INFO;

	// 로그인
	const login = async (principal: string, credentials: string) => {
		try {
			const { apiToken, doctor } = await axios
				.post("/api/auth/admin", {
					credentials,
					principal,
				})
				.then(({ data }: any) => data.response);

			const userInfo: SessionTokkenType = {
				isLogin: true, // 로그인 여부 필수 !
				...doctor,
			};

			localStorage.setItem(accessTokkenName, apiToken);
			//TODO 추가 적으로 등록할게 있으면 추가 예정
			// cookie.set(accessTokkenName, apiToken, cookieOpt);

			const _userInfo = CryptoJS.AES.encrypt(
				JSON.stringify(userInfo),
				import.meta.env.VITE_AUTH_SECRET,
			).toString();

			localStorage.setItem(userInfoName, _userInfo);

			//Loader 에서 사용하려면.. Cookie 저장 필요
			// cookie.set(userInfoName, _userInfo, cookieOpt);

			return {
				isLogin: true,
				message: "로그인 되었습니다.",
			};
		} catch (e: any) {
			const _message = e?.response?.data?.error?.message;

			return {
				isLogin: false,
				message: _message ? _message : "로그인에 실패하였습니다. ",
			};
		}
	};

	// Logout
	const logout = () => {
		[accessTokkenName, userInfoName].forEach((e: string) => {
			localStorage.removeItem(e);
			//cookie.remove(e, { path: "/" });
		});
		navigate("/login");
	};

	// 사용자 정보 - session tokken 에서 가져옴
	const getUserInfo = () => {
		try {
			// const _userInfo = cookie.get(userInfoName);
			const _userInfo = localStorage.getItem(userInfoName);

			if (_userInfo) {
				const info = CryptoJS.AES.decrypt(
					_userInfo,
					import.meta.env.VITE_AUTH_SECRET,
				).toString(CryptoJS.enc.Utf8);
				return JSON.parse(info);
			}
			return { isLogin: false, message: "사용자 정보가 없습니다." };
		} catch (e) {
			console.error("사용자 정보 오류 : ", e);
			return { isLogin: false, message: "사용자 정보오류" };
		}
	};
	// 로그인 여부 체크
	const isAuthLogin = () => {
		try {
			const _userInfo = localStorage.getItem(userInfoName);
			// const _userInfo = cookie.get(userInfoName);

			if (_userInfo) {
				const info = CryptoJS.AES.decrypt(
					_userInfo,
					import.meta.env.VITE_AUTH_SECRET,
				).toString(CryptoJS.enc.Utf8);
				const { isLogin } = JSON.parse(info);
				return isLogin;
			}
			return false;
		} catch (e) {
			console.error("로그인 정보 오류  : ", e);
			return false;
		}
	};

	return {
		login,
		logout,
		getUserInfo,
		isAuthLogin,
	};
};

export default useAuth;
