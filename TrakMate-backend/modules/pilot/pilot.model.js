import db from '../../config/dbconnect.js';

export async function getPilot() {
  // selectează coloanele de care ai nevoie
  const result = await db.pool.query(`
    SELECT "id", "firstName", "lastName" 
    FROM "app_user"
    WHERE "isActive" = true
    ORDER BY "id" ASC
  `);

  return result.rows; // <<< trimite lista de rânduri, nu obiectul întreg
}
