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
  try {
    const result = await pool.query('SELECT * FROM events');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
