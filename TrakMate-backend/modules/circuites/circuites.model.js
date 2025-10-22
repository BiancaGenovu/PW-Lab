import db from '../../config/dbconnect.js';

export async function getCircuites() {
  // selectează coloanele de care ai nevoie
  const result = await db.pool.query(`
    SELECT "id", "name", "km", "country"
    FROM "Circuit"
    WHERE "isActive" = true
    ORDER BY "name" ASC
  `);

  return result.rows; // <<< trimite lista de rânduri, nu obiectul întreg
}
