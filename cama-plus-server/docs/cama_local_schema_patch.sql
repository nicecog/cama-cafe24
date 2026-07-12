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

-- 진찰시 문의사항
CREATE SEQUENCE IF NOT EXISTS public.account_consultation_inquiry_seq
    START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public.account_consultation_inquiry (
    seq bigint DEFAULT nextval('public.account_consultation_inquiry_seq'::regclass) NOT NULL,
    account_seq bigint NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    is_transmitted boolean DEFAULT false NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT account_consultation_inquiry_pkey PRIMARY KEY (seq)
);

CREATE INDEX IF NOT EXISTS account_consultation_inquiry_account_idx
    ON public.account_consultation_inquiry (account_seq, created_at DESC)
    WHERE is_enabled = true;

CREATE SEQUENCE IF NOT EXISTS public.account_consultation_inquiry_history_seq
    START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public.account_consultation_inquiry_history (
    seq bigint DEFAULT nextval('public.account_consultation_inquiry_history_seq'::regclass) NOT NULL,
    inquiry_seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    action_type character varying(20) NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    is_transmitted boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT account_consultation_inquiry_history_pkey PRIMARY KEY (seq)
);

CREATE INDEX IF NOT EXISTS account_consultation_inquiry_history_inquiry_idx
    ON public.account_consultation_inquiry_history (inquiry_seq, created_at DESC);

CREATE INDEX IF NOT EXISTS account_consultation_inquiry_history_account_idx
    ON public.account_consultation_inquiry_history (account_seq, created_at DESC);
