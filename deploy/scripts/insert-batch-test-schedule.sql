-- Cafe24 batch FCM dry-run test (run on VPS cama DB)
-- Matches getScheduleBatchList: today KST + current minute + MEDICINE + alarm + firebase_token

DO $$
DECLARE
  v_account_seq bigint;
  v_schedule_seq bigint;
  v_batch_seq bigint;
  v_start_date text;
  v_time text;
BEGIN
  SELECT ft.account_seq INTO v_account_seq
  FROM firebase_token ft
  WHERE ft.is_enabled = true AND ft.token IS NOT NULL AND length(trim(ft.token)) > 10
  ORDER BY ft.updated_at DESC NULLS LAST
  LIMIT 1;

  IF v_account_seq IS NULL THEN
    RAISE EXCEPTION 'No enabled firebase_token found';
  END IF;

  -- 다음 정각 분(KST)에 맞춤 — 삽입 후 1분 내 batchCheck가 pickup
  v_start_date := to_char((NOW() AT TIME ZONE 'Asia/Seoul' + interval '1 minute'), 'YYYY-MM-DD');
  v_time := to_char((NOW() AT TIME ZONE 'Asia/Seoul' + interval '1 minute'), 'HH24:MI:00');

  INSERT INTO account_schedule (
    account_seq, schedule_type, start_date, end_date, "time",
    repeat, alarm, is_enabled, schedule_name, memo
  ) VALUES (
    v_account_seq, 'MEDICINE', v_start_date, v_start_date, v_time,
    false, true, true, 'CAFE24_BATCH_TEST', 'auto test for FCM dry-run'
  ) RETURNING seq INTO v_schedule_seq;

  INSERT INTO account_batch_schedule (
    schedule_seq, start_date, end_date, "time",
    is_done, is_enabled, account_seq
  ) VALUES (
    v_schedule_seq, v_start_date, v_start_date, v_time,
    false, true, v_account_seq
  ) RETURNING seq INTO v_batch_seq;

  RAISE NOTICE 'TEST_INSERT account_seq=% schedule_seq=% batch_seq=% start_date=% time=%',
    v_account_seq, v_schedule_seq, v_batch_seq, v_start_date, v_time;
END $$;

-- Verify row would be picked by batch query
SELECT bs.seq, bs.account_seq, sch.schedule_type, bs.start_date, bs.time, left(tk.token, 24) AS token_prefix
FROM account_batch_schedule bs
JOIN account_schedule sch ON sch.seq = bs.schedule_seq
JOIN firebase_token tk ON tk.account_seq = bs.account_seq AND tk.is_enabled
WHERE sch.schedule_name = 'CAFE24_BATCH_TEST'
  AND bs.is_enabled AND sch.is_enabled AND sch.alarm
  AND bs.start_date = to_char(NOW() AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD')
  AND bs.time = to_char((NOW() AT TIME ZONE 'Asia/Seoul' + interval '1 minute'), 'HH24:MI:00');
