import { VercelRequest, VercelResponse } from '@vercel/node';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgres://default:jaOhQqS02gyZ@ep-soft-bread-41762341-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb",
  ssl: {
    rejectUnauthorized: false
  }
});

export default async (req: any, res: any) => { // Use 'any' type for req and res
  const {
    event_name,
    event_date,
    event_location,
    numTopTables,
    maxSizeTopTable,
    numNormalTables,
    maxSizeNormalTable,
  } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO events (event_name, event_date, event_location, num_top_tables, size_top_tables, num_normal_tables, size_normal_tables) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        event_name,
        event_date,
        event_location,
        numTopTables,
        maxSizeTopTable,
        numNormalTables,
        maxSizeNormalTable,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

