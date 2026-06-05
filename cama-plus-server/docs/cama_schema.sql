--
-- PostgreSQL database dump
--

\restrict 6vBtkU5QySefa10I5QjepUDmbbwEbNAamNNYtk0053f0Qd5typroYDBQTEzf5Iy

-- Dumped from database version 15.12
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    seq bigint NOT NULL,
    login_id character varying(50) NOT NULL,
    email character varying(50),
    nick_name character varying(50),
    name character varying(50),
    phone character varying(20),
    birth character varying(20),
    gender character varying(20),
    sign_type character varying(20),
    password character varying(255) NOT NULL,
    profile_image character varying(200),
    imp_uid character varying(50),
    is_enabled boolean DEFAULT true,
    is_dropped boolean DEFAULT false,
    dropped_out_date character varying(50),
    drop_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_type_cd character varying(2)
);


--
-- Name: TABLE account; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.account IS '회원 정보';


--
-- Name: account_batch_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_batch_schedule (
    seq bigint NOT NULL,
    schedule_seq bigint NOT NULL,
    start_date character varying(19) NOT NULL,
    end_date character varying(19),
    "time" character varying(20),
    is_done boolean DEFAULT false,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    account_seq bigint
);


--
-- Name: account_batch_schedule_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_batch_schedule_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_batch_schedule_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.account_batch_schedule_seq_seq OWNED BY public.account_batch_schedule.seq;


--
-- Name: account_cnt_statistics_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_cnt_statistics_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_cnt_statistics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_cnt_statistics (
    seq bigint DEFAULT nextval('public.account_cnt_statistics_seq'::regclass) NOT NULL,
    year_month character varying(6) NOT NULL,
    user_type_cd character varying(2) NOT NULL,
    value1 bigint,
    value2 bigint,
    value3 bigint,
    value4 bigint,
    value5 bigint,
    value6 bigint,
    value7 bigint,
    value8 bigint,
    value9 bigint,
    value10 bigint,
    attribute1 character varying(20),
    attribute2 character varying(20),
    attribute3 character varying(20),
    attribute4 character varying(20),
    attribute5 character varying(20),
    attribute6 character varying(20),
    attribute7 character varying(20),
    attribute8 character varying(20),
    attribute9 character varying(20),
    attribute10 character varying(20),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN account_cnt_statistics.seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_cnt_statistics.seq IS 'Seq';


--
-- Name: COLUMN account_cnt_statistics.year_month; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_cnt_statistics.year_month IS '년월';


--
-- Name: COLUMN account_cnt_statistics.user_type_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_cnt_statistics.user_type_cd IS '사용자유형코드';


--
-- Name: COLUMN account_cnt_statistics.value1; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_cnt_statistics.value1 IS '측정 시작시점 사용자 수(매월1일)';


--
-- Name: COLUMN account_cnt_statistics.value2; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_cnt_statistics.value2 IS '측정 종료시점 사용자 수(매월말일)';


--
-- Name: COLUMN account_cnt_statistics.value3; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_cnt_statistics.value3 IS '해당 월의 일일활성 사용자 평균 사용자 수';


--
-- Name: COLUMN account_cnt_statistics.value4; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_cnt_statistics.value4 IS '월간 1회 이상 로그인한 사용자 수';


--
-- Name: COLUMN account_cnt_statistics.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_cnt_statistics.created_at IS '생성일';


--
-- Name: COLUMN account_cnt_statistics.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_cnt_statistics.updated_at IS '변경일';


--
-- Name: account_disease; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_disease (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    service_seq bigint NOT NULL,
    disease_seq bigint NOT NULL,
    disease_name character varying(50),
    disease_detail_seq bigint NOT NULL,
    disease_detail_name character varying(50),
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    doctor_seq bigint
);


--
-- Name: account_disease_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_disease_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_disease_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.account_disease_seq_seq OWNED BY public.account_disease.seq;


--
-- Name: account_login_history_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_login_history_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_login_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_login_history (
    seq bigint DEFAULT nextval('public.account_login_history_seq'::regclass) NOT NULL,
    account_seq bigint NOT NULL,
    login_at timestamp with time zone,
    logout_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN account_login_history.seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_login_history.seq IS 'Seq';


--
-- Name: COLUMN account_login_history.account_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_login_history.account_seq IS '사용자Seq';


--
-- Name: COLUMN account_login_history.login_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_login_history.login_at IS '로그인 일시';


--
-- Name: COLUMN account_login_history.logout_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_login_history.logout_at IS '로그아웃 일시';


--
-- Name: COLUMN account_login_history.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_login_history.created_at IS '생성일';


--
-- Name: COLUMN account_login_history.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_login_history.updated_at IS '변경일';


--
-- Name: account_recent_notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_recent_notification (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    message text NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: account_recent_notification_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_recent_notification_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_recent_notification_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.account_recent_notification_seq_seq OWNED BY public.account_recent_notification.seq;


--
-- Name: account_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_roles (
    account_seq bigint NOT NULL,
    roles character varying(255)
);


--
-- Name: account_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_schedule (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    disease_seq jsonb,
    schedule_type character varying(20) NOT NULL,
    start_date character varying(19) NOT NULL,
    end_date character varying(19),
    "time" character varying(20),
    days jsonb,
    repeat boolean DEFAULT false,
    alarm boolean DEFAULT false,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    schedule_name character varying(100),
    memo text
);


--
-- Name: COLUMN account_schedule.memo; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_schedule.memo IS '메모';


--
-- Name: account_schedule_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_schedule_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_schedule_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.account_schedule_seq_seq OWNED BY public.account_schedule.seq;


--
-- Name: account_search_history_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_search_history_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_search_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_search_history (
    seq bigint DEFAULT nextval('public.account_search_history_seq'::regclass) NOT NULL,
    account_seq bigint NOT NULL,
    cancer_type character varying(2),
    search_text character varying(40),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN account_search_history.seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_search_history.seq IS 'Seq';


--
-- Name: COLUMN account_search_history.account_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_search_history.account_seq IS '사용자Seq';


--
-- Name: COLUMN account_search_history.cancer_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_search_history.cancer_type IS '암종류';


--
-- Name: COLUMN account_search_history.search_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_search_history.search_text IS '검색어';


--
-- Name: COLUMN account_search_history.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_search_history.created_at IS '생성일';


--
-- Name: COLUMN account_search_history.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_search_history.updated_at IS '변경일';


--
-- Name: account_secure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_secure (
    seq bigint NOT NULL,
    secure_code character varying(50) NOT NULL,
    account_seq bigint NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: account_secure_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_secure_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_secure_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.account_secure_seq_seq OWNED BY public.account_secure.seq;


--
-- Name: account_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.account_seq_seq OWNED BY public.account.seq;


--
-- Name: account_step_history_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_step_history_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_step_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_step_history (
    seq bigint DEFAULT nextval('public.account_step_history_seq'::regclass) NOT NULL,
    execution_date character varying(19) NOT NULL,
    account_seq bigint NOT NULL,
    step_num bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN account_step_history.seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_step_history.seq IS 'Seq';


--
-- Name: COLUMN account_step_history.execution_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_step_history.execution_date IS '실행';


--
-- Name: COLUMN account_step_history.account_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_step_history.account_seq IS '사용자Seq';


--
-- Name: COLUMN account_step_history.step_num; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_step_history.step_num IS '걸음수';


--
-- Name: COLUMN account_step_history.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_step_history.created_at IS '생성일';


--
-- Name: COLUMN account_step_history.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.account_step_history.updated_at IS '변경일';


--
-- Name: care_time_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.care_time_type (
    seq bigint NOT NULL,
    name character varying(200) NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE care_time_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.care_time_type IS '치료 시기';


--
-- Name: care_type_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.care_type_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: care_type_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.care_type_seq_seq OWNED BY public.care_time_type.seq;


--
-- Name: cm_admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_admin (
    seq bigint NOT NULL,
    login_id character varying(50) NOT NULL,
    password text NOT NULL,
    name character varying(50) NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: cm_admin_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_admin_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_admin_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_admin_seq_seq OWNED BY public.cm_admin.seq;


--
-- Name: cm_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_contents (
    seq bigint NOT NULL,
    doctor_seq bigint NOT NULL,
    title text NOT NULL,
    contents text,
    care_time_type character varying(200),
    interest jsonb,
    is_enabled boolean DEFAULT true,
    is_viewed boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    disease_seq bigint,
    image text,
    keyword character varying(50),
    specific_keyword character varying(200),
    disease jsonb,
    view_count bigint DEFAULT 0,
    contents_updated_at character varying(19),
    priority bigint DEFAULT 5
);


--
-- Name: TABLE cm_contents; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.cm_contents IS '치료정보';


--
-- Name: COLUMN cm_contents.priority; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_contents.priority IS '우선순위';


--
-- Name: cm_contents_check; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_contents_check (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    track_service_seq bigint NOT NULL,
    contents_seq bigint NOT NULL,
    progress bigint DEFAULT 0 NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: cm_contents_check_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_contents_check_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_contents_check_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_contents_check_seq_seq OWNED BY public.cm_contents_check.seq;


--
-- Name: cm_contents_favorite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_contents_favorite (
    seq bigint NOT NULL,
    account_seq bigint,
    contents_seq bigint NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: cm_contents_favorite_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_contents_favorite_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_contents_favorite_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_contents_favorite_seq OWNED BY public.cm_contents_favorite.seq;


--
-- Name: cm_contents_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_contents_log (
    seq bigint NOT NULL,
    log_type character varying(20) NOT NULL,
    contents_seq bigint NOT NULL,
    account_seq bigint,
    progress bigint DEFAULT 0 NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: cm_contents_log_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_contents_log_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_contents_log_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_contents_log_seq_seq OWNED BY public.cm_contents_log.seq;


--
-- Name: cm_contents_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_contents_seq_seq
    START WITH 400
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_contents_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_contents_seq_seq OWNED BY public.cm_contents.seq;


--
-- Name: cm_contents_video; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_contents_video (
    seq bigint NOT NULL,
    priority bigint NOT NULL,
    video_type_cd character varying(4) NOT NULL,
    url character varying(400),
    use_yn character varying(1) NOT NULL,
    detail_desc character varying(4000),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN cm_contents_video.seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_contents_video.seq IS 'Seq';


--
-- Name: COLUMN cm_contents_video.priority; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_contents_video.priority IS '우선순위';


--
-- Name: COLUMN cm_contents_video.video_type_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_contents_video.video_type_cd IS '영상유형코드';


--
-- Name: COLUMN cm_contents_video.url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_contents_video.url IS 'Url';


--
-- Name: COLUMN cm_contents_video.use_yn; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_contents_video.use_yn IS '사용여부';


--
-- Name: COLUMN cm_contents_video.detail_desc; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_contents_video.detail_desc IS '상세설명';


--
-- Name: cm_contents_video_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_contents_video_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_contents_video_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_contents_video_seq OWNED BY public.cm_contents_video.seq;


--
-- Name: cm_department; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_department (
    seq bigint NOT NULL,
    name character varying(50) NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE cm_department; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.cm_department IS '진료 과';


--
-- Name: cm_department_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_department_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_department_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_department_seq_seq OWNED BY public.cm_department.seq;


--
-- Name: cm_disease; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_disease (
    seq bigint NOT NULL,
    name character varying(50) NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE cm_disease; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.cm_disease IS '질병';


--
-- Name: cm_disease_detail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_disease_detail (
    seq bigint NOT NULL,
    disease_seq bigint NOT NULL,
    hospital_seq bigint NOT NULL,
    name character varying(50) NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: cm_disease_detail_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_disease_detail_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_disease_detail_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_disease_detail_seq_seq OWNED BY public.cm_disease_detail.seq;


--
-- Name: cm_disease_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_disease_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_disease_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_disease_seq_seq OWNED BY public.cm_disease.seq;


--
-- Name: cm_doctor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_doctor (
    seq bigint NOT NULL,
    login_id character varying(50) NOT NULL,
    password text NOT NULL,
    name character varying(50) NOT NULL,
    hospital_seq bigint NOT NULL,
    department_seq bigint NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    nick character varying(30),
    profile_image text,
    profile_link text,
    phone character varying(30),
    lasted_at character varying(19)
);


--
-- Name: cm_doctor_disease; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_doctor_disease (
    seq bigint NOT NULL,
    doctor_seq bigint NOT NULL,
    disease_seq bigint NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE cm_doctor_disease; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.cm_doctor_disease IS '의사 질병 카테고리';


--
-- Name: cm_doctor_disease_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_doctor_disease_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_doctor_disease_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_doctor_disease_seq_seq OWNED BY public.cm_doctor_disease.seq;


--
-- Name: cm_doctor_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_doctor_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_doctor_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_doctor_seq_seq OWNED BY public.cm_doctor.seq;


--
-- Name: cm_hospital; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_hospital (
    seq bigint NOT NULL,
    name character varying(50) NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    corp_number character varying(20),
    address text,
    homepage text,
    prof_name character varying(30),
    prof_major character varying(50),
    prof_email character varying(50),
    prof_phone character varying(30)
);


--
-- Name: TABLE cm_hospital; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.cm_hospital IS '병원';


--
-- Name: cm_hospital_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_hospital_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_hospital_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_hospital_seq_seq OWNED BY public.cm_hospital.seq;


--
-- Name: cm_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_schedule (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    schedule_time character varying(10) NOT NULL,
    cycle character varying(10) NOT NULL,
    cycle_name character varying(50) NOT NULL,
    cycle_type character varying(50) NOT NULL,
    disease character varying(50) NOT NULL,
    is_pushed boolean DEFAULT true,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: cm_schedule_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_schedule_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_schedule_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_schedule_seq_seq OWNED BY public.cm_schedule.seq;


--
-- Name: cm_wellbeing_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cm_wellbeing_resources (
    seq bigint NOT NULL,
    wellbeing_category_cd character varying(2) NOT NULL,
    company_name character varying(240) NOT NULL,
    company_description text,
    title text NOT NULL,
    contents text,
    thumbnail text,
    address text,
    phone_number character varying(80),
    homepage character varying(200),
    sns character varying(100),
    is_enabled boolean DEFAULT true,
    priority bigint DEFAULT 5,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN cm_wellbeing_resources.seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.seq IS 'Seq';


--
-- Name: COLUMN cm_wellbeing_resources.wellbeing_category_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.wellbeing_category_cd IS '웰빙자원 카테고리 코드';


--
-- Name: COLUMN cm_wellbeing_resources.company_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.company_name IS '기업명';


--
-- Name: COLUMN cm_wellbeing_resources.company_description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.company_description IS '기업설명';


--
-- Name: COLUMN cm_wellbeing_resources.title; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.title IS '제목';


--
-- Name: COLUMN cm_wellbeing_resources.contents; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.contents IS '내용';


--
-- Name: COLUMN cm_wellbeing_resources.thumbnail; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.thumbnail IS 'Thumbnail';


--
-- Name: COLUMN cm_wellbeing_resources.address; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.address IS '주소';


--
-- Name: COLUMN cm_wellbeing_resources.phone_number; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.phone_number IS '전화번호';


--
-- Name: COLUMN cm_wellbeing_resources.homepage; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.homepage IS '홈페이지';


--
-- Name: COLUMN cm_wellbeing_resources.sns; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.sns IS 'Sns';


--
-- Name: COLUMN cm_wellbeing_resources.is_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.is_enabled IS '활성화여부';


--
-- Name: COLUMN cm_wellbeing_resources.priority; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cm_wellbeing_resources.priority IS '우선순위';


--
-- Name: cm_wellbeing_resources_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cm_wellbeing_resources_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cm_wellbeing_resources_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cm_wellbeing_resources_seq OWNED BY public.cm_wellbeing_resources.seq;


--
-- Name: coaching_account_exercise_class; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_account_exercise_class (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    cancer_type_cd character varying(4) NOT NULL,
    exercise_program_cd character varying(4) NOT NULL,
    aerobic character varying(2),
    therapy_cd character varying(4),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN coaching_account_exercise_class.seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_account_exercise_class.seq IS 'Seq';


--
-- Name: COLUMN coaching_account_exercise_class.account_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_account_exercise_class.account_seq IS '사용자Seq';


--
-- Name: COLUMN coaching_account_exercise_class.cancer_type_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_account_exercise_class.cancer_type_cd IS '암유형코드';


--
-- Name: COLUMN coaching_account_exercise_class.exercise_program_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_account_exercise_class.exercise_program_cd IS '운동프로그램코드';


--
-- Name: COLUMN coaching_account_exercise_class.aerobic; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_account_exercise_class.aerobic IS '유산소여부(Y/N)';


--
-- Name: COLUMN coaching_account_exercise_class.therapy_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_account_exercise_class.therapy_cd IS '특수치료코드';


--
-- Name: COLUMN coaching_account_exercise_class.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_account_exercise_class.created_at IS '생성일';


--
-- Name: COLUMN coaching_account_exercise_class.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_account_exercise_class.updated_at IS '변경일';


--
-- Name: coaching_account_exercise_class_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coaching_account_exercise_class_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coaching_account_exercise_class_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coaching_account_exercise_class_seq OWNED BY public.coaching_account_exercise_class.seq;


--
-- Name: coaching_exercise_contents_mst_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coaching_exercise_contents_mst_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coaching_exercise_contents_mst; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_exercise_contents_mst (
    seq bigint DEFAULT nextval('public.coaching_exercise_contents_mst_seq'::regclass) NOT NULL,
    exercise_type_cd character varying(4) NOT NULL,
    index_num bigint NOT NULL,
    difficulty_cd character varying(4),
    eng_name character varying(200),
    kor_name character varying(200),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN coaching_exercise_contents_mst.seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_contents_mst.seq IS 'Seq';


--
-- Name: COLUMN coaching_exercise_contents_mst.exercise_type_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_contents_mst.exercise_type_cd IS '운동종류코드';


--
-- Name: COLUMN coaching_exercise_contents_mst.index_num; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_contents_mst.index_num IS '운동순서';


--
-- Name: COLUMN coaching_exercise_contents_mst.difficulty_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_contents_mst.difficulty_cd IS '난이도코드';


--
-- Name: COLUMN coaching_exercise_contents_mst.eng_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_contents_mst.eng_name IS '영문제목';


--
-- Name: COLUMN coaching_exercise_contents_mst.kor_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_contents_mst.kor_name IS '한글제목';


--
-- Name: COLUMN coaching_exercise_contents_mst.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_contents_mst.created_at IS '생성일';


--
-- Name: COLUMN coaching_exercise_contents_mst.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_contents_mst.updated_at IS '변경일';


--
-- Name: coaching_exercise_progress_result_hst; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_exercise_progress_result_hst (
    survey_seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    answer_choice_seq bigint NOT NULL,
    answer_choice character varying(4000),
    ref_val1 character varying(40),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN coaching_exercise_progress_result_hst.survey_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_progress_result_hst.survey_seq IS '설문Seq';


--
-- Name: COLUMN coaching_exercise_progress_result_hst.account_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_progress_result_hst.account_seq IS '사용자Seq';


--
-- Name: COLUMN coaching_exercise_progress_result_hst.answer_choice_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_progress_result_hst.answer_choice_seq IS '답변순번';


--
-- Name: COLUMN coaching_exercise_progress_result_hst.answer_choice; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_progress_result_hst.answer_choice IS '답변';


--
-- Name: COLUMN coaching_exercise_progress_result_hst.ref_val1; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_progress_result_hst.ref_val1 IS '참조값';


--
-- Name: COLUMN coaching_exercise_progress_result_hst.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_progress_result_hst.created_at IS '생성일';


--
-- Name: COLUMN coaching_exercise_progress_result_hst.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_progress_result_hst.updated_at IS '변경일';


--
-- Name: coaching_exercise_survey_result_hst; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_exercise_survey_result_hst (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    survey_result jsonb,
    cancer_type_cd character varying(4),
    difficulty_cd character varying(4),
    aerobic character varying(1),
    therapy_cd character varying(4),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN coaching_exercise_survey_result_hst.seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_survey_result_hst.seq IS 'Seq';


--
-- Name: COLUMN coaching_exercise_survey_result_hst.account_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_survey_result_hst.account_seq IS '사용자Seq';


--
-- Name: COLUMN coaching_exercise_survey_result_hst.survey_result; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_survey_result_hst.survey_result IS '설문결과';


--
-- Name: COLUMN coaching_exercise_survey_result_hst.cancer_type_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_survey_result_hst.cancer_type_cd IS '암유형코드';


--
-- Name: COLUMN coaching_exercise_survey_result_hst.difficulty_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_survey_result_hst.difficulty_cd IS '난이도코드';


--
-- Name: COLUMN coaching_exercise_survey_result_hst.aerobic; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_survey_result_hst.aerobic IS '유산소여부(Y/N)';


--
-- Name: COLUMN coaching_exercise_survey_result_hst.therapy_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_survey_result_hst.therapy_cd IS '특수치료코드';


--
-- Name: COLUMN coaching_exercise_survey_result_hst.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_survey_result_hst.created_at IS '생성일';


--
-- Name: COLUMN coaching_exercise_survey_result_hst.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_exercise_survey_result_hst.updated_at IS '변경일';


--
-- Name: coaching_exercise_survey_result_hst_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coaching_exercise_survey_result_hst_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coaching_exercise_survey_result_hst_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coaching_exercise_survey_result_hst_seq OWNED BY public.coaching_exercise_survey_result_hst.seq;


--
-- Name: coaching_question_detail_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_question_detail_info (
    category_cd character varying(4) NOT NULL,
    step_day_cd character varying(4) NOT NULL,
    progress_type_cd character varying(4) NOT NULL,
    detail_seq bigint NOT NULL,
    detail_info character varying(4000),
    add_detail_info character varying(4000),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE coaching_question_detail_info; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.coaching_question_detail_info IS '건강코칭 질문 상세 정보';


--
-- Name: COLUMN coaching_question_detail_info.category_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_detail_info.category_cd IS '건강코칭 카테고리 코드';


--
-- Name: COLUMN coaching_question_detail_info.step_day_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_detail_info.step_day_cd IS '건강코칭 일차 코드';


--
-- Name: COLUMN coaching_question_detail_info.progress_type_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_detail_info.progress_type_cd IS '건강코칭 진행 코드';


--
-- Name: COLUMN coaching_question_detail_info.detail_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_detail_info.detail_seq IS '순번';


--
-- Name: COLUMN coaching_question_detail_info.detail_info; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_detail_info.detail_info IS '상세내용';


--
-- Name: COLUMN coaching_question_detail_info.add_detail_info; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_detail_info.add_detail_info IS '추가상세내용';


--
-- Name: coaching_question_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_question_info (
    category_cd character varying(4) NOT NULL,
    step_day_cd character varying(4) NOT NULL,
    progress_type_cd character varying(4) NOT NULL,
    answer_type_cd character varying(4) NOT NULL,
    hospital_seq bigint NOT NULL,
    contents_info character varying(400),
    question_answer_cnt bigint,
    question character varying(4000),
    question_orgl character varying(6000),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE coaching_question_info; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.coaching_question_info IS '건강코칭 질문 정보';


--
-- Name: COLUMN coaching_question_info.category_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_info.category_cd IS '건강코칭 카테고리 코드';


--
-- Name: COLUMN coaching_question_info.step_day_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_info.step_day_cd IS '건강코칭 일차 코드';


--
-- Name: COLUMN coaching_question_info.progress_type_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_info.progress_type_cd IS '건강코칭 진행 코드';


--
-- Name: COLUMN coaching_question_info.answer_type_cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_info.answer_type_cd IS '건강코칭 답변 방식 코드';


--
-- Name: COLUMN coaching_question_info.hospital_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_info.hospital_seq IS '병원seq';


--
-- Name: COLUMN coaching_question_info.contents_info; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_info.contents_info IS '건강코칭 컨텐츠 주요내용';


--
-- Name: COLUMN coaching_question_info.question_answer_cnt; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_info.question_answer_cnt IS '질문응답수';


--
-- Name: COLUMN coaching_question_info.question; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_info.question IS '질문';


--
-- Name: COLUMN coaching_question_info.question_orgl; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.coaching_question_info.question_orgl IS '오리지널 질문';


--
-- Name: coaching_user_add_answer_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_user_add_answer_info (
    account_seq bigint NOT NULL,
    category_cd character varying(4) NOT NULL,
    step_day_cd character varying(4) NOT NULL,
    progress_type_cd character varying(4) NOT NULL,
    answer_choice_seq bigint NOT NULL,
    answer_choice character varying(4000),
    ref_val1 character varying(40),
    ref_val2 character varying(40),
    ref_val3 character varying(40),
    ref_val4 character varying(40),
    ref_val5 character varying(40),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: coaching_user_answer_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_user_answer_info (
    account_seq bigint NOT NULL,
    category_cd character varying(4) NOT NULL,
    step_day_cd character varying(4) NOT NULL,
    progress_type_cd character varying(4) NOT NULL,
    answer_choice_seq bigint NOT NULL,
    answer_choice character varying(4000),
    ref_val1 character varying(40),
    ref_val2 character varying(40),
    ref_val3 character varying(40),
    ref_val4 character varying(40),
    ref_val5 character varying(40),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: firebase_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.firebase_token (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    platform character varying(20) NOT NULL,
    device character varying(50) NOT NULL,
    token text,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE firebase_token; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.firebase_token IS '푸시 토큰';


--
-- Name: firebase_token_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.firebase_token_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: firebase_token_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.firebase_token_seq_seq OWNED BY public.firebase_token.seq;


--
-- Name: hospital_service; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hospital_service (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    hospital_seq bigint NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: hospital_service_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hospital_service_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hospital_service_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hospital_service_seq_seq OWNED BY public.hospital_service.seq;


--
-- Name: hp_disease; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hp_disease (
    seq bigint NOT NULL,
    hospital_seq bigint NOT NULL,
    disease_seq bigint NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE hp_disease; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.hp_disease IS '병원별 질환 명칭';


--
-- Name: hp_disease_option; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hp_disease_option (
    seq bigint NOT NULL,
    hp_disease_seq bigint NOT NULL,
    group_name character varying(50) NOT NULL,
    option_name character varying(50) NOT NULL,
    sort bigint,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: hp_disease_option_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hp_disease_option_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hp_disease_option_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hp_disease_option_seq_seq OWNED BY public.hp_disease_option.seq;


--
-- Name: hp_disease_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hp_disease_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hp_disease_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hp_disease_seq_seq OWNED BY public.hp_disease.seq;


--
-- Name: hp_disease_treatment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hp_disease_treatment (
    seq bigint NOT NULL,
    hp_disease_seq bigint NOT NULL,
    name character varying(50) NOT NULL,
    sort bigint,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    treatment_period character varying(300) DEFAULT NULL::character varying
);


--
-- Name: COLUMN hp_disease_treatment.treatment_period; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.hp_disease_treatment.treatment_period IS '치료시기';


--
-- Name: hp_disease_treatment_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hp_disease_treatment_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hp_disease_treatment_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hp_disease_treatment_seq_seq OWNED BY public.hp_disease_treatment.seq;


--
-- Name: sys_code_det; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sys_code_det (
    code character varying(50) NOT NULL,
    cd character varying(30) NOT NULL,
    val character varying(100),
    use_yn character varying(1),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE sys_code_det; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.sys_code_det IS '시스템  코드 상세 관리';


--
-- Name: COLUMN sys_code_det.code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sys_code_det.code IS '구분코드';


--
-- Name: COLUMN sys_code_det.cd; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sys_code_det.cd IS '코드';


--
-- Name: COLUMN sys_code_det.val; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sys_code_det.val IS '코드값';


--
-- Name: COLUMN sys_code_det.use_yn; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sys_code_det.use_yn IS '사용여부(Y/N)';


--
-- Name: sys_code_mst; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sys_code_mst (
    code character varying(50) NOT NULL,
    name character varying(100),
    use_yn character varying(1),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE sys_code_mst; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.sys_code_mst IS '시스템 코드 마스터 관리';


--
-- Name: COLUMN sys_code_mst.code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sys_code_mst.code IS '구분코드';


--
-- Name: COLUMN sys_code_mst.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sys_code_mst.name IS '구분코드명';


--
-- Name: COLUMN sys_code_mst.use_yn; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sys_code_mst.use_yn IS '사용여부(Y/N)';


--
-- Name: track_service; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.track_service (
    seq bigint NOT NULL,
    account_seq bigint NOT NULL,
    hospital_seq bigint NOT NULL,
    disease_seq bigint NOT NULL,
    days bigint NOT NULL,
    interest character varying(100) NOT NULL,
    data jsonb,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    disease_stage character varying(20),
    treatment character varying(100),
    status character varying(20),
    disease jsonb
);


--
-- Name: COLUMN track_service.disease_stage; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.track_service.disease_stage IS '병기';


--
-- Name: COLUMN track_service.treatment; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.track_service.treatment IS '치료시기';


--
-- Name: track_service_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.track_service_seq_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: track_service_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.track_service_seq_seq OWNED BY public.track_service.seq;


--
-- Name: account seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account ALTER COLUMN seq SET DEFAULT nextval('public.account_seq_seq'::regclass);


--
-- Name: account_batch_schedule seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_batch_schedule ALTER COLUMN seq SET DEFAULT nextval('public.account_batch_schedule_seq_seq'::regclass);


--
-- Name: account_disease seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_disease ALTER COLUMN seq SET DEFAULT nextval('public.account_disease_seq_seq'::regclass);


--
-- Name: account_recent_notification seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_recent_notification ALTER COLUMN seq SET DEFAULT nextval('public.account_recent_notification_seq_seq'::regclass);


--
-- Name: account_schedule seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_schedule ALTER COLUMN seq SET DEFAULT nextval('public.account_schedule_seq_seq'::regclass);


--
-- Name: account_secure seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_secure ALTER COLUMN seq SET DEFAULT nextval('public.account_secure_seq_seq'::regclass);


--
-- Name: care_time_type seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_time_type ALTER COLUMN seq SET DEFAULT nextval('public.care_type_seq_seq'::regclass);


--
-- Name: cm_admin seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_admin ALTER COLUMN seq SET DEFAULT nextval('public.cm_admin_seq_seq'::regclass);


--
-- Name: cm_contents seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents ALTER COLUMN seq SET DEFAULT nextval('public.cm_contents_seq_seq'::regclass);


--
-- Name: cm_contents_check seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents_check ALTER COLUMN seq SET DEFAULT nextval('public.cm_contents_check_seq_seq'::regclass);


--
-- Name: cm_contents_favorite seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents_favorite ALTER COLUMN seq SET DEFAULT nextval('public.cm_contents_favorite_seq'::regclass);


--
-- Name: cm_contents_log seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents_log ALTER COLUMN seq SET DEFAULT nextval('public.cm_contents_log_seq_seq'::regclass);


--
-- Name: cm_contents_video seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents_video ALTER COLUMN seq SET DEFAULT nextval('public.cm_contents_video_seq'::regclass);


--
-- Name: cm_department seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_department ALTER COLUMN seq SET DEFAULT nextval('public.cm_department_seq_seq'::regclass);


--
-- Name: cm_disease seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_disease ALTER COLUMN seq SET DEFAULT nextval('public.cm_disease_seq_seq'::regclass);


--
-- Name: cm_disease_detail seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_disease_detail ALTER COLUMN seq SET DEFAULT nextval('public.cm_disease_detail_seq_seq'::regclass);


--
-- Name: cm_doctor seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_doctor ALTER COLUMN seq SET DEFAULT nextval('public.cm_doctor_seq_seq'::regclass);


--
-- Name: cm_doctor_disease seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_doctor_disease ALTER COLUMN seq SET DEFAULT nextval('public.cm_doctor_disease_seq_seq'::regclass);


--
-- Name: cm_hospital seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_hospital ALTER COLUMN seq SET DEFAULT nextval('public.cm_hospital_seq_seq'::regclass);


--
-- Name: cm_schedule seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_schedule ALTER COLUMN seq SET DEFAULT nextval('public.cm_schedule_seq_seq'::regclass);


--
-- Name: cm_wellbeing_resources seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_wellbeing_resources ALTER COLUMN seq SET DEFAULT nextval('public.cm_wellbeing_resources_seq'::regclass);


--
-- Name: coaching_account_exercise_class seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_account_exercise_class ALTER COLUMN seq SET DEFAULT nextval('public.coaching_account_exercise_class_seq'::regclass);


--
-- Name: coaching_exercise_survey_result_hst seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_exercise_survey_result_hst ALTER COLUMN seq SET DEFAULT nextval('public.coaching_exercise_survey_result_hst_seq'::regclass);


--
-- Name: firebase_token seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.firebase_token ALTER COLUMN seq SET DEFAULT nextval('public.firebase_token_seq_seq'::regclass);


--
-- Name: hospital_service seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hospital_service ALTER COLUMN seq SET DEFAULT nextval('public.hospital_service_seq_seq'::regclass);


--
-- Name: hp_disease seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hp_disease ALTER COLUMN seq SET DEFAULT nextval('public.hp_disease_seq_seq'::regclass);


--
-- Name: hp_disease_option seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hp_disease_option ALTER COLUMN seq SET DEFAULT nextval('public.hp_disease_option_seq_seq'::regclass);


--
-- Name: hp_disease_treatment seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hp_disease_treatment ALTER COLUMN seq SET DEFAULT nextval('public.hp_disease_treatment_seq_seq'::regclass);


--
-- Name: track_service seq; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.track_service ALTER COLUMN seq SET DEFAULT nextval('public.track_service_seq_seq'::regclass);


--
-- Name: account_batch_schedule account_batch_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_batch_schedule
    ADD CONSTRAINT account_batch_schedule_pkey PRIMARY KEY (seq);


--
-- Name: account_cnt_statistics account_cnt_statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_cnt_statistics
    ADD CONSTRAINT account_cnt_statistics_pkey PRIMARY KEY (seq);


--
-- Name: account_disease account_disease_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_disease
    ADD CONSTRAINT account_disease_pkey PRIMARY KEY (seq);


--
-- Name: account_login_history account_login_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_login_history
    ADD CONSTRAINT account_login_history_pkey PRIMARY KEY (seq);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (seq);


--
-- Name: account_recent_notification account_recent_notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_recent_notification
    ADD CONSTRAINT account_recent_notification_pkey PRIMARY KEY (seq);


--
-- Name: account_schedule account_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_schedule
    ADD CONSTRAINT account_schedule_pkey PRIMARY KEY (seq);


--
-- Name: account_search_history account_search_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_search_history
    ADD CONSTRAINT account_search_history_pkey PRIMARY KEY (seq);


--
-- Name: account_secure account_secure_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_secure
    ADD CONSTRAINT account_secure_pkey PRIMARY KEY (seq);


--
-- Name: account_step_history account_step_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_step_history
    ADD CONSTRAINT account_step_history_pkey PRIMARY KEY (seq);


--
-- Name: care_time_type care_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_time_type
    ADD CONSTRAINT care_type_pkey PRIMARY KEY (seq);


--
-- Name: cm_admin cm_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_admin
    ADD CONSTRAINT cm_admin_pkey PRIMARY KEY (seq);


--
-- Name: cm_contents_check cm_contents_check_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents_check
    ADD CONSTRAINT cm_contents_check_pkey PRIMARY KEY (seq);


--
-- Name: cm_contents_favorite cm_contents_favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents_favorite
    ADD CONSTRAINT cm_contents_favorite_pkey PRIMARY KEY (seq);


--
-- Name: cm_contents_log cm_contents_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents_log
    ADD CONSTRAINT cm_contents_log_pkey PRIMARY KEY (seq);


--
-- Name: cm_contents cm_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents
    ADD CONSTRAINT cm_contents_pkey PRIMARY KEY (seq);


--
-- Name: cm_department cm_department_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_department
    ADD CONSTRAINT cm_department_pkey PRIMARY KEY (seq);


--
-- Name: cm_disease_detail cm_disease_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_disease_detail
    ADD CONSTRAINT cm_disease_detail_pkey PRIMARY KEY (seq);


--
-- Name: cm_disease cm_disease_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_disease
    ADD CONSTRAINT cm_disease_pkey PRIMARY KEY (seq);


--
-- Name: cm_doctor_disease cm_doctor_disease_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_doctor_disease
    ADD CONSTRAINT cm_doctor_disease_pkey PRIMARY KEY (seq);


--
-- Name: cm_doctor cm_doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_doctor
    ADD CONSTRAINT cm_doctor_pkey PRIMARY KEY (seq);


--
-- Name: cm_hospital cm_hospital_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_hospital
    ADD CONSTRAINT cm_hospital_pkey PRIMARY KEY (seq);


--
-- Name: cm_schedule cm_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_schedule
    ADD CONSTRAINT cm_schedule_pkey PRIMARY KEY (seq);


--
-- Name: cm_wellbeing_resources cm_wellbeing_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_wellbeing_resources
    ADD CONSTRAINT cm_wellbeing_resources_pkey PRIMARY KEY (seq);


--
-- Name: coaching_account_exercise_class coaching_account_exercise_class_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_account_exercise_class
    ADD CONSTRAINT coaching_account_exercise_class_pkey PRIMARY KEY (seq);


--
-- Name: coaching_exercise_contents_mst coaching_exercise_contents_mst_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_exercise_contents_mst
    ADD CONSTRAINT coaching_exercise_contents_mst_pkey PRIMARY KEY (seq);


--
-- Name: coaching_exercise_progress_result_hst coaching_exercise_progress_result_hst_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_exercise_progress_result_hst
    ADD CONSTRAINT coaching_exercise_progress_result_hst_pkey PRIMARY KEY (survey_seq, account_seq, answer_choice_seq);


--
-- Name: coaching_exercise_survey_result_hst coaching_exercise_survey_result_hst_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_exercise_survey_result_hst
    ADD CONSTRAINT coaching_exercise_survey_result_hst_pkey PRIMARY KEY (seq);


--
-- Name: coaching_question_detail_info coaching_question_detail_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_question_detail_info
    ADD CONSTRAINT coaching_question_detail_info_pkey PRIMARY KEY (category_cd, step_day_cd, progress_type_cd, detail_seq);


--
-- Name: coaching_question_info coaching_question_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_question_info
    ADD CONSTRAINT coaching_question_info_pkey PRIMARY KEY (category_cd, step_day_cd, progress_type_cd);


--
-- Name: coaching_user_add_answer_info coaching_user_add_answer_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_user_add_answer_info
    ADD CONSTRAINT coaching_user_add_answer_info_pkey PRIMARY KEY (account_seq, category_cd, step_day_cd, progress_type_cd, answer_choice_seq);


--
-- Name: coaching_user_answer_info coaching_user_answer_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_user_answer_info
    ADD CONSTRAINT coaching_user_answer_info_pkey PRIMARY KEY (account_seq, category_cd, step_day_cd, progress_type_cd, answer_choice_seq);


--
-- Name: firebase_token firebase_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.firebase_token
    ADD CONSTRAINT firebase_token_pkey PRIMARY KEY (seq);


--
-- Name: hospital_service hospital_service_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hospital_service
    ADD CONSTRAINT hospital_service_pkey PRIMARY KEY (seq);


--
-- Name: hp_disease_option hp_disease_option_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hp_disease_option
    ADD CONSTRAINT hp_disease_option_pkey PRIMARY KEY (seq);


--
-- Name: hp_disease hp_disease_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hp_disease
    ADD CONSTRAINT hp_disease_pkey PRIMARY KEY (seq);


--
-- Name: hp_disease_treatment hp_disease_treatment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hp_disease_treatment
    ADD CONSTRAINT hp_disease_treatment_pkey PRIMARY KEY (seq);


--
-- Name: sys_code_det sys_code_det_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sys_code_det
    ADD CONSTRAINT sys_code_det_pkey PRIMARY KEY (code, cd);


--
-- Name: sys_code_mst sys_code_mst_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sys_code_mst
    ADD CONSTRAINT sys_code_mst_pkey PRIMARY KEY (code);


--
-- Name: cm_contents_video sys_video_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cm_contents_video
    ADD CONSTRAINT sys_video_info_pkey PRIMARY KEY (seq);


--
-- Name: track_service track_service_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.track_service
    ADD CONSTRAINT track_service_pkey PRIMARY KEY (seq);


--
-- Name: account_roles fkpf8v11ga45csghn7hhfpg7vq5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT fkpf8v11ga45csghn7hhfpg7vq5 FOREIGN KEY (account_seq) REFERENCES public.account(seq);


--
-- PostgreSQL database dump complete
--

\unrestrict 6vBtkU5QySefa10I5QjepUDmbbwEbNAamNNYtk0053f0Qd5typroYDBQTEzf5Iy

