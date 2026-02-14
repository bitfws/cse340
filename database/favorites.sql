CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    account_id INT REFERENCES account(account_id),
    inv_id INT REFERENCES inventory(inv_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, inv_id)
);

INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2);

DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2;

SELECT i.* FROM inventory i
JOIN favorites f ON i.inv_id = f.inv_id
WHERE f.account_id = $1;
