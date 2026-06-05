-- 로컬 개발용 관리자 계정 (login: localadmin / password: localadmin123)
INSERT INTO public.cm_admin (login_id, password, name, is_enabled)
VALUES (
    'localadmin',
    '$2a$10$Ozp4MIZAiAqs0tgxvuearObsVIbMx/fUt4kvYwuZXPeaq3uM3nfgu',
    'Local Admin',
    true
)
ON CONFLICT DO NOTHING;
