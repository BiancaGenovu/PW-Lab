import db from '../../config/dbconnect.js';

export async function getCircuites() {
  const result = await db.pool.query(`
    SELECT "id", "name", "km", "country", "circuitImage"
    FROM "Circuit"
    WHERE "isActive" = true
    ORDER BY "name" ASC
  `);

  return result.rows;
}