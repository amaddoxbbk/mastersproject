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
  const { attendee_name, event_id, relationship, blacklist_attendee_ids, guest_allergies, is_bride, is_groom, partner_to } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO attendees (event_id, attendee_name, relationship, blacklist_attendee_ids, guest_allergies, is_bride, is_groom, partner_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [event_id, attendee_name, relationship, blacklist_attendee_ids, guest_allergies, is_bride, is_groom, partner_to]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
