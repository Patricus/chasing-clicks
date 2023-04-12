// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const ip: string = req.connection.remoteAddress as string;

    fetch(
        `https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.IP_API_KEY}&ip_address=${ip}&fields=city`
    )
        .then(res => res.json())
        .then(city => {
            res.status(200).json(city);
        })
        .catch(err => {
            res.status(500).json({ error: "Internal server error" });
            console.error(err);
        });
}
