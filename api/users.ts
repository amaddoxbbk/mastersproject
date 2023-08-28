import { VercelRequest, VercelResponse } from '@vercel/node';
import pkg from 'pg';
const { Pool } = pkg;

// Create a new pool using the connection string and enable SSL
const pool = new Pool({
  connectionString: "postgres://default:jaOhQqS02gyZ@ep-soft-bread-41762341-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb",
  ssl: {
    rejectUnauthorized: false // You may want to update this in production
  }
});

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Execute the query
    const result = await client.query('SELECT * FROM party');
    const rows = result.rows;

    // Release the client
    client.release();

    // Log and return the results
    console.log("Fetched rows:", rows);
    res.status(200).json(rows);

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
