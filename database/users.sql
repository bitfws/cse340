INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
) VALUES
(
    'Basic',
    'Client',
    'basic@340.edu',
    'I@mABas1cCl!3nt'
),
(
    'Happy',
    'Employee',
    'happy@340.edu',
    'I@mAnEmpl0y33'
),
(
    'Manager',
    'User',
    'manager@340.edu',
    'I@mAnAdm!n1strat0r'
);

UPDATE account
SET account_type = 'Employee'
WHERE account_email = 'happy@340.edu';


UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'manager@340.edu';
