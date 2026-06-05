-- Create doctor login: cama / admincama!
INSERT INTO cm_doctor (
    login_id,
    password,
    name,
    hospital_seq,
    department_seq,
    is_enabled
) VALUES (
    'cama',
    '$2b$10$sOH9gesedUbxwboTf8IXBO8iX0NXHQq/aGvZ2YWd2fF85JKP7IwfG',
    'CAMA',
    1,
    1,
    true
)
ON CONFLICT DO NOTHING;

SELECT seq, login_id, name, hospital_seq, department_seq, is_enabled
FROM cm_doctor
WHERE login_id = 'cama';
