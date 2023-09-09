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
  console.log("Endpoint triggered");
  
  const { attendee_id } = req.body;
  console.log(`Received attendee_id: ${attendee_id}`);

  if (!attendee_id) {
    console.log("attendee_id is missing");
    return res.status(400).json({ error: 'attendee_id is required' });
  }

  try {
    console.log("Attempting to find plus one...");
    const plusOneResult = await pool.query(
      'SELECT * FROM attendees WHERE partner_to = $1',
      [attendee_id]
    );
    console.log(`Found ${plusOneResult.rowCount} plus one(s)`);

    // Delete the plus one first, if any
    if (plusOneResult.rowCount > 0) {
      console.log("Attempting to delete plus one...");
      const plusOneId = plusOneResult.rows[0].attendee_id;
      await pool.query(
        'DELETE FROM attendees WHERE attendee_id = $1',
        [plusOneId]
      );
      console.log("Plus one deleted");
    }

    console.log("Attempting to delete main guest...");
    const mainGuestResult = await pool.query(
      'DELETE FROM attendees WHERE attendee_id = $1 RETURNING *',
      [attendee_id]
    );
    console.log(`Deleted ${mainGuestResult.rowCount} main guest(s)`);

    if (mainGuestResult.rowCount === 0) {
      console.log("Main guest not found");
      return res.status(404).json({ error: 'Main guest not found' });
    }

    console.log("Successfully removed guest(s)");
    res.status(200).json({ message: 'Guest(s) removed successfully', removedGuest: mainGuestResult.rows[0] });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
