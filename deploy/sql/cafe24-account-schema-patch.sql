-- Cafe24 Postgres: Account entity drift fix (required for /api/account/me, login-id change)
ALTER TABLE public.account ADD COLUMN IF NOT EXISTS patient_management_number character varying(50);

CREATE UNIQUE INDEX IF NOT EXISTS account_patient_mgmt_number_unique
  ON public.account (patient_management_number)
  WHERE patient_management_number IS NOT NULL
    AND btrim(patient_management_number) <> ''
    AND is_dropped = false;
