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
  const { event_name, event_date, event_location } = req.body;

  try {
    console.log("trying to add event_name: ", event_name);
    const result = await pool.query(
      'INSERT INTO events (event_name, event_date, event_location) VALUES ($1, $2, $3) RETURNING *',
      [event_name, event_date, event_location]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
