-- 심박수 일별 통계 — 로컬/운영 공통 DDL
CREATE SEQUENCE IF NOT EXISTS public.account_heart_rate_statistics_seq
    START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public.account_heart_rate_statistics (
    seq bigint DEFAULT nextval('public.account_heart_rate_statistics_seq'::regclass) NOT NULL,
    account_seq bigint NOT NULL,
    stat_date date NOT NULL,
    sample_count integer NOT NULL DEFAULT 0,
    min_bpm numeric(8, 2),
    max_bpm numeric(8, 2),
    avg_bpm numeric(8, 2),
    first_measured_at timestamp with time zone,
    last_measured_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT account_heart_rate_statistics_pkey PRIMARY KEY (seq)
);

CREATE UNIQUE INDEX IF NOT EXISTS account_heart_rate_statistics_account_date_uidx
    ON public.account_heart_rate_statistics (account_seq, stat_date);

CREATE INDEX IF NOT EXISTS account_heart_rate_statistics_stat_date_idx
    ON public.account_heart_rate_statistics (stat_date DESC);
