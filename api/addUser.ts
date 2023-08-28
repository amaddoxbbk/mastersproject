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
  const { attendee, plus_one } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO party (Attendee, plus_one) VALUES ($1, $2) RETURNING *',
      [attendee, plus_one]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
