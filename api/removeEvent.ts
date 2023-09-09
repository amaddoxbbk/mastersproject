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
  const { event_id } = req.body;

  if (!event_id) {
    return res.status(400).json({ error: 'event_id is required' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM events WHERE event_id = $1 RETURNING *',
      [event_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event removed successfully', removedEvent: result.rows[0] });
  } catch (error: any) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
