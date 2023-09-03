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
  const { attendee_id } = req.body;

  if (!attendee_id) {
    return res.status(400).json({ error: 'attendee_id is required' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM attendees WHERE attendee_id = $1 RETURNING *',
      [attendee_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.status(200).json({ message: 'Guest removed successfully', removedGuest: result.rows[0] });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
