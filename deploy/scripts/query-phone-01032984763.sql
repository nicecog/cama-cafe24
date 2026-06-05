-- Investigate phone 01032984763 signup vs find-id mismatch
SELECT seq, login_id, name, phone, email, sign_type, is_enabled, is_dropped, created_at
FROM account
WHERE phone LIKE '%32984763%'
   OR REPLACE(REPLACE(phone, '-', ''), ' ', '') LIKE '%01032984763%'
ORDER BY seq;

SELECT count(*) AS total_with_substring
FROM account
WHERE phone LIKE '%32984763%';

SELECT seq, login_id, name, phone, is_enabled, is_dropped
FROM account
WHERE REPLACE(REPLACE(phone, '-', ''), ' ', '') = '01032984763';
