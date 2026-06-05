// Auth API
export * as authApi from "./auth";
// 개별 함수 export (선택적)
export {
  changePassword,
  login,
  loginCredentials,
  logout,
  register,
  resetPassword,
} from "./auth";

// Common API
export * as commonApi from "./common";
export { getDiseaseList as getCommonDiseaseList } from "./common";

// Hospital API
export * as hospitalApi from "./hospital";
export {
  applyHospitalService,
  checkHospitalService,
  getHospital,
  getHospitalDiseaseList,
  getHospitalDoctorList,
  getHospitalList,
} from "./hospital";
// Track API
