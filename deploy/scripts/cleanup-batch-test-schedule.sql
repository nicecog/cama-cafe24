DELETE FROM account_batch_schedule
WHERE schedule_seq IN (SELECT seq FROM account_schedule WHERE schedule_name = 'CAFE24_BATCH_TEST');

DELETE FROM account_schedule WHERE schedule_name = 'CAFE24_BATCH_TEST';
