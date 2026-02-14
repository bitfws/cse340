const pool = require('../database');

const favoritesModel = {};

/* ************************************
 * Add a vehicle to a user's favorites
 **************************************/
favoritesModel.addFavorite = async (account_id, inv_id) => {
  const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;
  const values = [account_id, inv_id];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

/* ************************************
 * Remove a vehicle from a user's favorites
 **************************************/
favoritesModel.removeFavorite = async (account_id, inv_id) => {
  const sql = `
    DELETE FROM favorites
    WHERE account_id = $1 AND inv_id = $2
    RETURNING *;
  `;
  const values = [account_id, inv_id];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

/* ************************************
 * Get all vehicles favorited by a user
 **************************************/
favoritesModel.getUserFavorites = async (account_id) => {
  const sql = `
    SELECT 
      inv.*,
      c.classification_name
    FROM inventory inv
    JOIN favorites f ON inv.inv_id = f.inv_id
    JOIN classification c 
      ON inv.classification_id = c.classification_id
    WHERE f.account_id = $1
    ORDER BY inv.inv_make, inv.inv_model;
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows;
};

module.exports = favoritesModel;
