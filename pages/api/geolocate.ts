// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get IP address from request
    const ip: string = requestIp.getClientIp(req) || "0.0.0.0";

    // Get city from IP address
    fetch(
        `https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.IP_API_KEY}&ip_address=${ip}&fields=city,region,country`
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
