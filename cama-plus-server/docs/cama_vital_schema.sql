-- 심박·생체신호 이력 — 로컬/운영 공통 DDL
CREATE SEQUENCE IF NOT EXISTS public.account_vital_history_seq
    START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

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

CREATE INDEX IF NOT EXISTS account_vital_history_account_measured_idx
    ON public.account_vital_history (account_seq, measured_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS account_vital_history_dedup_idx
    ON public.account_vital_history (account_seq, vital_type_cd, measured_at);
