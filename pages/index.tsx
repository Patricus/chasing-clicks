import { useEffect, useState } from "react";
import { Pool } from "pg";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home({ initCount }: { initCount: number }) {
    const [count, setCount] = useState(initCount || 0);
    const [city, setCity] = useState("Unknown");

    const handleClick = async () => {
        const res = await fetch("/api/clicks", {
            method: "POST",
            body: JSON.stringify({ city }),
        });
        const count = await res.json();
        setCount(count);
    };

    const getCity = async () => {
        const res = await fetch("api/geolocate");
        const { city } = await res.json();
        setCity(city || "Unknown");
    };

    useEffect(() => {
        getCity();
    }, [setCount, setCity]);

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

    const data = await pool.query("SELECT SUM(count) FROM clicks");
    const count = data.rows[0].sum;

    return { props: { initCount: count } };
}
