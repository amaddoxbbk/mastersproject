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

  try {
    await pool.query(
      'DELETE FROM attendees WHERE event_id = $1 AND (is_bride = true OR is_groom = true)',
      [event_id]
    );

    res.status(200).json({ message: 'Successfully removed the couple.' });
  } catch (error) {
    console.error("Error removing couple:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
