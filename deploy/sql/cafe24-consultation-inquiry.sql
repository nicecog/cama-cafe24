-- 진찰시 문의사항 — 로컬/운영 공통 DDL
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
