-- 로컬 DDL(cama_schema.sql)과 Java 엔티티 간 drift 보정 (Gabia/운영 DB에는 이미 있을 수 있음)
-- scripts/patch-local-schema-drift.ps1 로 적용

ALTER TABLE public.account ADD COLUMN IF NOT EXISTS lang character varying(10) DEFAULT 'KO';
ALTER TABLE public.cm_disease ADD COLUMN IF NOT EXISTS lang character varying(10) DEFAULT 'KO';
ALTER TABLE public.cm_contents ADD COLUMN IF NOT EXISTS lang character varying(10) DEFAULT 'KO';
ALTER TABLE public.cm_contents_video ADD COLUMN IF NOT EXISTS lang character varying(10) DEFAULT 'KO';

-- account_search_history: acSeq=0 이력 INSERT 허용 (비로그인 contents 검색)
ALTER TABLE public.account_search_history ALTER COLUMN account_seq DROP NOT NULL;

ALTER TABLE public.account ADD COLUMN IF NOT EXISTS patient_management_number character varying(50);

CREATE UNIQUE INDEX IF NOT EXISTS account_patient_mgmt_number_unique
  ON public.account (patient_management_number)
  WHERE patient_management_number IS NOT NULL
    AND btrim(patient_management_number) <> ''
    AND is_dropped = false;

INSERT INTO public.cm_disease (name, is_enabled, lang)
SELECT v.name, true, 'KO'
FROM (VALUES
    ('유방암'),
    ('폐암'),
    ('대장암'),
    ('위암'),
    ('갑상선암')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM public.cm_disease LIMIT 1);
