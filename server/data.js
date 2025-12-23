import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false},
})

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err);
});

export default pool;