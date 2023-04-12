import db from "./connection";

export default function createDB() {
    // Create schema if DATABASE_URL contains schema
    const schema = process.env.DATABASE_URL?.split("?schema=")[1];

    if (schema && schema.length > 0) {
        db.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
    }

    // Create clicks table
    db.query(
        `CREATE TABLE IF NOT EXISTS clicks (
            city VARCHAR(255) PRIMARY KEY,
            count INTEGER NOT NULL
        )`
    );
}
