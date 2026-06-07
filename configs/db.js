import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });


const pool = new pg.Pool({
  connectionString: process.env.DRIZZLE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export default pool;

