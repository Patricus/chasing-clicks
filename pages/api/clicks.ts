// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/connection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        // Get city from request body
        const body = JSON.parse(req.body);
        const city = body.city || "Unknown";

        // Increase click count of city by 1
        await db.query(
            `INSERT INTO clicks (city, count) VALUES ('${city}', 1) ON CONFLICT (city) DO UPDATE SET count = clicks.count + 1`
        );

        // Get total click count
        const data = await db.query("SELECT SUM(count) FROM clicks");
        const count = data.rows[0].sum;

        // Return total click count
        res.status(200).json(count);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
