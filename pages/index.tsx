import { useEffect, useState } from "react";
import { Pool } from "pg";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

type Data = {
    city: string;
    count: number;
};

export default function Home({ data }: { data: Data[] }) {
    const initCount = data.reduce((acc, curr) => acc + curr.count, 0);
    const [count, setCount] = useState(initCount || 0);

    const [city, setCity] = useState("Unknown");

    const handleClick = async () => {
        const res = await fetch("/api/clicks", {
            method: "POST",
            body: JSON.stringify({ city }),
        });
        const count = await res.json();
        setCount(count);
        data[data.findIndex(row => row.city === city)].count += 1;
    };

    const getCity = async () => {
        const res = await fetch("api/geolocate");
        const { city } = await res.json();
        setCity(city || "Unknown");
    };

    useEffect(() => {
        getCity();
    }, [setCity]);

    return (
        <>
            <Head>
                <title>Chasing the Clicks</title>
                <meta name="description" content="Software Engineering Super League Level 1" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1>Chasing the Clicks</h1>
                <button onClick={handleClick}>Click Me</button>
                <h2>{`${count} total clicks`}</h2>
                <h2>{`Your location is ${city}`}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>City</th>
                            <th>Clicks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => (
                            <tr key={row.city}>
                                <td>{row.city}</td>
                                <td>{row.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </>
    );
}

export async function getServerSideProps() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const { rows: data } = await pool.query("SELECT * FROM clicks");

    return { props: { data } };
}
