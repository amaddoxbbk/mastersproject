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
    const { event_id: eventId } = req.body; // Get the event_id from the request body

    if (!eventId) {
      res.status(400).json({ error: 'Missing event_id parameter' });
      return;
    }

    const result = await pool.query('SELECT * FROM attendees WHERE event_id = $1 Order By 1', [eventId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
