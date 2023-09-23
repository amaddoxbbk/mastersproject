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
      'DELETE FROM attendees WHERE event_id = $1 RETURNING *',
      [event_id]
    );

    if (result.rowCount === 0) {
      return res.status(200).json({ error: 'No guests found for this event' }); // if no guest found delete is 'successful'
    }

    res.status(200).json({ message: 'Guests removed successfully', removedGuests: result.rows });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
