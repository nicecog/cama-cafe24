-- 심박·생체신호 이력 (Cafe24 PostgreSQL)
-- 적용: psql -f deploy/sql/cafe24-account-vital-history.sql

CREATE SEQUENCE IF NOT EXISTS public.account_vital_history_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.account_vital_history (
    seq bigint DEFAULT nextval('public.account_vital_history_seq'::regclass) NOT NULL,
    account_seq bigint NOT NULL,
    measured_at timestamp with time zone NOT NULL,
    vital_type_cd character varying(30) NOT NULL,
    value_num numeric(12, 4) NOT NULL,
    unit character varying(20),
    source_cd character varying(30) DEFAULT 'MANUAL'::character varying NOT NULL,
    memo character varying(500),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT account_vital_history_pkey PRIMARY KEY (seq)
);

COMMENT ON TABLE public.account_vital_history IS '환자 심박·생체신호 측정 이력';
COMMENT ON COLUMN public.account_vital_history.account_seq IS '사용자 Seq';
COMMENT ON COLUMN public.account_vital_history.measured_at IS '측정 시각';
COMMENT ON COLUMN public.account_vital_history.vital_type_cd IS 'HEART_RATE, BP_SYSTOLIC, BP_DIASTOLIC, SPO2, BODY_TEMP, RESPIRATORY_RATE';
COMMENT ON COLUMN public.account_vital_history.value_num IS '측정값';
COMMENT ON COLUMN public.account_vital_history.unit IS 'bpm, mmHg, %, C 등';
COMMENT ON COLUMN public.account_vital_history.source_cd IS 'MANUAL, PHONE, WEARABLE';

CREATE INDEX IF NOT EXISTS account_vital_history_account_measured_idx
    ON public.account_vital_history (account_seq, measured_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS account_vital_history_dedup_idx
    ON public.account_vital_history (account_seq, vital_type_cd, measured_at);
