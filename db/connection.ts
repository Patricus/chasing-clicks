import { Pool } from "pg";

// This is the connection to the database
export default new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
