export interface PatientAvailabilityResp {
  available: boolean;
  message: string;
}

export interface PatientFindLoginIdResp {
  found: boolean;
  loginId?: string;
  message: string;
}

export interface PatientFindPasswordResp {
  sent: boolean;
  message: string;
}

export interface PatientResetPasswordResp {
  reset: boolean;
  temporaryPassword?: string;
  message: string;
}
