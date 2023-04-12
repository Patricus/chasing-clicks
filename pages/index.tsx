import { useEffect, useState } from "react";
import db from "@/db/connection";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

type Data = {
    city: string;
    count: number;
};

export default function Home({ data, sum }: { data: Data[]; sum: number }) {
    const [clickData, setClickData] = useState<Data[]>(data || []);
    const [count, setCount] = useState<number>(sum || 0);
    const [city, setCity] = useState<string | null>(null);
    const [cityIdx, setCityIdx] = useState<number>(-1);

    const findCityIdx = () => clickData.findIndex(row => row.city === city);

    const handleClick = async () => {
        // API call to increment click count
        const res = await fetch("/api/clicks", {
            method: "POST",
            body: JSON.stringify({ city }),
        });
        const count = await res.json();

        // Update total click count
        setCount(count);

        if (cityIdx === -1 && city) {
            // If city doesn't exist, add it
            setClickData(clickData.concat({ city, count: 1 }));
        } else {
            // If city exists, increment count for that city
            setClickData(
                clickData.map(row => (row.city === city ? { ...row, count: row.count + 1 } : row))
            );
        }
    };

    useEffect(() => {
        // Get user's location
        (async () => {
            const res = await fetch("api/geolocate");
            const { city } = await res.json();
            setCity(city || "Unknown");
        })();
    }, [setCity]);

    useEffect(() => {
        // Find index of city
        setCityIdx(findCityIdx());
    }, [city, clickData]);

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
                <button onClick={handleClick} disabled={Boolean(!city)}>
                    Click Me
                </button>
                <h2>{`${count} total clicks`}</h2>
                {city ? <h2>{`Your location is ${city}`}</h2> : <h2>Locating...</h2>}
                <table>
                    <thead>
                        <tr>
                            <th>City</th>
                            <th>Clicks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clickData
                            .sort((a, b) => {
                                if (a.city.toLowerCase() < b.city.toLowerCase()) return -1;
                                if (a.city.toLowerCase() > b.city.toLowerCase()) return 1;
                                return 0;
                            })
                            .map(row => (
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
    // Create table if it doesn't exist
    await db.query(
        "CREATE TABLE IF NOT EXISTS clicks (city VARCHAR(255) PRIMARY KEY, count INTEGER NOT NULL)"
    );

    // Get click data from database
    const { rows: data } = await db.query("SELECT * FROM clicks");
    const sum = data.reduce((acc, curr) => acc + curr.count, 0);

    return { props: { data, sum } };
}
