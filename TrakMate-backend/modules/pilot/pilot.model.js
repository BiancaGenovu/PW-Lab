import db from '../../config/dbconnect.js';

export async function getPilot() {
  // selectează coloanele de care ai nevoie + profileImage
  const result = await db.pool.query(`
    SELECT "id", "firstName", "lastName", "profileImage"
    FROM "app_user"
    WHERE "isActive" = true
    ORDER BY "id" ASC
  `);

  return result.rows;
}