// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const body = JSON.parse(req.body);
        console.log("body", body);
        const city = body.city || "Unknown";
        console.log("city", city);
        // if (!city) {
        //     city = "Unknown";
        // }
        await pool.query(
            `INSERT INTO clicks (city, count) VALUES ('${city}', 1) ON CONFLICT (city) DO UPDATE SET count = clicks.count + 1`
        );
        const data = await pool.query("SELECT SUM(count) FROM clicks");
        const count = data.rows[0].sum;
        res.status(200).json(count);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
