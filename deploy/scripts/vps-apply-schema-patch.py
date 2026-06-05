#!/usr/bin/env python3
import subprocess

sql = """
ALTER TABLE public.account ADD COLUMN IF NOT EXISTS patient_management_number character varying(50);
CREATE UNIQUE INDEX IF NOT EXISTS account_patient_mgmt_number_unique
  ON public.account (patient_management_number)
  WHERE patient_management_number IS NOT NULL
    AND btrim(patient_management_number) <> ''
    AND is_dropped = false;
"""

subprocess.run(
    [
        "docker",
        "exec",
        "c6fdf0e55844_cama-cafe24-postgres",
        "psql",
        "-U",
        "cama",
        "-d",
        "cama",
        "-c",
        sql,
    ],
    check=True,
)
print("schema patch applied")
