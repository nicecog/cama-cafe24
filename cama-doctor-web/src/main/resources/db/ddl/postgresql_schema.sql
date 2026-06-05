-- CAMA 의사 웹 PostgreSQL 초기 스키마 (snake_case)
-- 관계: app_user는 Firebase UID 기준 단일 사용자. doctor_seq는 외부 Billive 의사 키(선택).

CREATE TABLE IF NOT EXISTS app_user (
    id              BIGSERIAL PRIMARY KEY,
    firebase_uid    VARCHAR(128) NOT NULL UNIQUE,
    email           VARCHAR(255),
    doctor_seq      BIGINT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_user_doctor_seq ON app_user (doctor_seq);

COMMENT ON TABLE app_user IS 'Firebase 인증 사용자와 로컬 프로필 매핑';
COMMENT ON COLUMN app_user.firebase_uid IS 'Firebase Authentication UID';
COMMENT ON COLUMN app_user.doctor_seq IS 'Billive API doctor.seq (선택 매핑)';
