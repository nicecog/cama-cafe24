-- 로컬 개발용 병원 시드 (앱 병원 검색 테스트)
INSERT INTO public.cm_hospital (name, is_enabled, address, homepage)
SELECT '중앙대학교 병원', true, '서울특별시 동작구 흑석로 102', 'https://www.cauhs.or.kr'
WHERE NOT EXISTS (SELECT 1 FROM public.cm_hospital WHERE name = '중앙대학교 병원');

INSERT INTO public.cm_hospital (name, is_enabled, address, homepage)
SELECT '서울대학교 병원', true, '서울특별시 종로구 대학로 101', 'https://www.snuh.org'
WHERE NOT EXISTS (SELECT 1 FROM public.cm_hospital WHERE name = '서울대학교 병원');
