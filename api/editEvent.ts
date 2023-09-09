import { VercelRequest, VercelResponse } from '@vercel/node';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgres://default:jaOhQqS02gyZ@ep-soft-bread-41762341-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb",
  ssl: {
    rejectUnauthorized: false
  }
});

export default async (req: VercelRequest, res: VercelResponse) => {
  const {
    event_id,
    numTopTables,
    maxSizeTopTable,
    numNormalTables,
    maxSizeNormalTable,
  } = req.body;

  if (!event_id) {
    return res.status(400).json({ error: 'event_id is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE events SET num_top_tables = $1, size_top_tables = $2, num_normal_tables = $3, size_normal_tables = $4 WHERE event_id = $5 RETURNING *',
      [
        numTopTables,
        maxSizeTopTable,
        numNormalTables,
        maxSizeNormalTable,
        event_id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
