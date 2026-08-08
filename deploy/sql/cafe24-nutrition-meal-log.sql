-- 음식 사진 칼로리 기록 (Cafe24 PostgreSQL)
-- 설계: docs/CAMAPLUS_FOOD_CALORIE_APP_SERVER_DESIGN.md
-- 적용: psql -f deploy/sql/cafe24-nutrition-meal-log.sql
-- 시딩: psql -f deploy/sql/cafe24-nutrition-food-class-seed.sql (본 스크립트 이후 실행)

-- =============================================================
-- 1. 마스터 — 탐지 클래스 ↔ 식품코드 매핑
-- =============================================================

CREATE SEQUENCE IF NOT EXISTS public.cm_food_class_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.cm_food_class (
    seq bigint DEFAULT nextval('public.cm_food_class_seq'::regclass) NOT NULL,
    class_id integer NOT NULL,
    class_key character varying(64) NOT NULL,
    name_ko character varying(128) NOT NULL,
    category_nm character varying(64),
    food_code character varying(32),
    serving_g numeric(9, 2) NOT NULL,
    priority_cd character varying(8),
    fb_kcal numeric(9, 2),
    fb_carb_g numeric(9, 2),
    fb_protein_g numeric(9, 2),
    fb_fat_g numeric(9, 2),
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT cm_food_class_pkey PRIMARY KEY (seq),
    CONSTRAINT cm_food_class_class_id_key UNIQUE (class_id),
    CONSTRAINT cm_food_class_class_key_key UNIQUE (class_key)
);

COMMENT ON TABLE public.cm_food_class IS '온디바이스 음식 탐지 클래스 마스터 (MVP 100종)';
COMMENT ON COLUMN public.cm_food_class.class_id IS '모델 출력 인덱스. 재학습 전까지 불변';
COMMENT ON COLUMN public.cm_food_class.class_key IS '앱·서버 공통 식별자 (예: gimbap)';
COMMENT ON COLUMN public.cm_food_class.food_code IS '식약처 식품코드. 미매핑 시 NULL이며 fb_* 폴백 사용';
COMMENT ON COLUMN public.cm_food_class.serving_g IS '표준 1인분 중량(g)';
COMMENT ON COLUMN public.cm_food_class.priority_cd IS 'P0 / P1 / P2 — 학습 데이터 확보 우선순위';
COMMENT ON COLUMN public.cm_food_class.fb_kcal IS '폴백 영양: 100g당 열량(kcal)';
COMMENT ON COLUMN public.cm_food_class.fb_carb_g IS '폴백 영양: 100g당 탄수화물(g)';
COMMENT ON COLUMN public.cm_food_class.fb_protein_g IS '폴백 영양: 100g당 단백질(g)';
COMMENT ON COLUMN public.cm_food_class.fb_fat_g IS '폴백 영양: 100g당 지방(g)';

CREATE INDEX IF NOT EXISTS cm_food_class_name_idx
    ON public.cm_food_class (name_ko);

-- =============================================================
-- 2. 마스터 — 식약처 영양성분 (100g 기준)
-- =============================================================

CREATE SEQUENCE IF NOT EXISTS public.cm_food_nutrition_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.cm_food_nutrition (
    seq bigint DEFAULT nextval('public.cm_food_nutrition_seq'::regclass) NOT NULL,
    food_code character varying(32) NOT NULL,
    food_name character varying(256) NOT NULL,
    nutrition_version character varying(32) NOT NULL,
    kcal numeric(9, 2) NOT NULL,
    carb_g numeric(9, 2),
    protein_g numeric(9, 2),
    fat_g numeric(9, 2),
    sugar_g numeric(9, 2),
    sodium_mg numeric(10, 2),
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT cm_food_nutrition_pkey PRIMARY KEY (seq),
    CONSTRAINT cm_food_nutrition_code_version_key UNIQUE (food_code, nutrition_version)
);

COMMENT ON TABLE public.cm_food_nutrition IS '식약처 식품영양성분 DB (100g 기준). 버전별로 행을 누적한다';
COMMENT ON COLUMN public.cm_food_nutrition.nutrition_version IS '영양 DB 버전 (예: MFDS-2026.1). 과거 기록 재계산 대상 특정에 사용';

CREATE INDEX IF NOT EXISTS cm_food_nutrition_code_idx
    ON public.cm_food_nutrition (food_code);

-- =============================================================
-- 3. 기록 — 식사 로그 헤더
-- =============================================================

CREATE SEQUENCE IF NOT EXISTS public.account_meal_log_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.account_meal_log (
    seq bigint DEFAULT nextval('public.account_meal_log_seq'::regclass) NOT NULL,
    account_seq bigint NOT NULL,
    client_log_id character varying(36) NOT NULL,
    meal_type_cd character varying(16) NOT NULL,
    eaten_at timestamp with time zone NOT NULL,
    source_cd character varying(16) DEFAULT 'ONDEVICE'::character varying NOT NULL,
    total_kcal numeric(10, 2) DEFAULT 0 NOT NULL,
    total_carb_g numeric(10, 2) DEFAULT 0 NOT NULL,
    total_protein_g numeric(10, 2) DEFAULT 0 NOT NULL,
    total_fat_g numeric(10, 2) DEFAULT 0 NOT NULL,
    needs_review boolean DEFAULT false NOT NULL,
    nutrition_version character varying(32),
    model_version character varying(64),
    catalog_version character varying(32),
    model_profile character varying(16),
    inference_ms integer,
    app_version character varying(32),
    memo character varying(500),
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT account_meal_log_pkey PRIMARY KEY (seq)
);

COMMENT ON TABLE public.account_meal_log IS '사용자 식사 기록 헤더. 합계는 서버 재계산 결과만 저장한다';
COMMENT ON COLUMN public.account_meal_log.client_log_id IS '클라이언트 생성 UUID. 오프라인 재전송 멱등 키';
COMMENT ON COLUMN public.account_meal_log.meal_type_cd IS 'BREAKFAST, LUNCH, DINNER, SNACK';
COMMENT ON COLUMN public.account_meal_log.source_cd IS 'ONDEVICE(사진 추론), MANUAL(직접 입력)';
COMMENT ON COLUMN public.account_meal_log.needs_review IS '저신뢰·폴백 항목 포함 여부. 화면에서 확인 유도';
COMMENT ON COLUMN public.account_meal_log.nutrition_version IS '계산에 사용한 영양 DB 버전';
COMMENT ON COLUMN public.account_meal_log.inference_ms IS '온디바이스 추론 소요 시간(ms). 성능 모니터링용';

-- 동일 clientLogId 재전송을 DB 제약으로 흡수한다 (중복 저장 방지의 핵심)
CREATE UNIQUE INDEX IF NOT EXISTS account_meal_log_client_idx
    ON public.account_meal_log (account_seq, client_log_id);

CREATE INDEX IF NOT EXISTS account_meal_log_account_eaten_idx
    ON public.account_meal_log (account_seq, eaten_at DESC);

-- =============================================================
-- 4. 기록 — 식사 로그 항목 (계산 시점 영양 스냅샷)
-- =============================================================

CREATE SEQUENCE IF NOT EXISTS public.account_meal_log_item_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.account_meal_log_item (
    seq bigint DEFAULT nextval('public.account_meal_log_item_seq'::regclass) NOT NULL,
    meal_log_seq bigint NOT NULL,
    class_key character varying(64) NOT NULL,
    name_ko character varying(128) NOT NULL,
    food_code character varying(32),
    confidence numeric(5, 4),
    portion_factor numeric(5, 2) DEFAULT 1.0 NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    grams_g numeric(10, 2) NOT NULL,
    kcal numeric(10, 2) NOT NULL,
    carb_g numeric(10, 2),
    protein_g numeric(10, 2),
    fat_g numeric(10, 2),
    nutrition_source_cd character varying(24) NOT NULL,
    is_estimated boolean DEFAULT false NOT NULL,
    is_user_corrected boolean DEFAULT false NOT NULL,
    original_class_key character varying(64),
    client_kcal_preview numeric(10, 2),
    bbox jsonb,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT account_meal_log_item_pkey PRIMARY KEY (seq),
    CONSTRAINT account_meal_log_item_parent_fkey FOREIGN KEY (meal_log_seq)
        REFERENCES public.account_meal_log (seq) ON DELETE CASCADE
);

COMMENT ON TABLE public.account_meal_log_item IS '식사 항목별 영양 스냅샷. 영양 DB 갱신 후에도 과거 기록은 불변';
COMMENT ON COLUMN public.account_meal_log_item.grams_g IS 'serving_g x portion_factor x quantity';
COMMENT ON COLUMN public.account_meal_log_item.nutrition_source_cd IS 'MFDS(식약처 정본), CLASS_FALLBACK(클래스 폴백), NONE(영양값 없음)';
COMMENT ON COLUMN public.account_meal_log_item.is_estimated IS '폴백 영양값 사용 여부';
COMMENT ON COLUMN public.account_meal_log_item.original_class_key IS '사용자가 후보로 교체한 경우 모델 원본 예측값';
COMMENT ON COLUMN public.account_meal_log_item.client_kcal_preview IS '앱 미리보기 kcal. 계산에 사용하지 않으며 드리프트 모니터링 전용';

CREATE INDEX IF NOT EXISTS account_meal_log_item_parent_idx
    ON public.account_meal_log_item (meal_log_seq);

-- =============================================================
-- 5. 오분류 피드백 (재학습 데이터 확보)
-- =============================================================

CREATE SEQUENCE IF NOT EXISTS public.account_meal_feedback_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.account_meal_feedback (
    seq bigint DEFAULT nextval('public.account_meal_feedback_seq'::regclass) NOT NULL,
    account_seq bigint NOT NULL,
    meal_log_item_seq bigint,
    predicted_class character varying(64),
    corrected_class character varying(64),
    model_version character varying(64),
    confidence numeric(5, 4),
    memo character varying(500),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT account_meal_feedback_pkey PRIMARY KEY (seq)
);

COMMENT ON TABLE public.account_meal_feedback IS '음식 오분류 사용자 피드백. 재학습 클래스 우선순위 산정에 사용';

CREATE INDEX IF NOT EXISTS account_meal_feedback_account_idx
    ON public.account_meal_feedback (account_seq, created_at DESC);
