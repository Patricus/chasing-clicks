import { useEffect, useState } from "react";
import db from "@/db/connection";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import createDB from "@/db/create";

type Data = {
    location: string;
    count: number;
};

export default function Home({ data, sum }: { data: Data[]; sum: number }) {
    const [clickData, setClickData] = useState<Data[]>(data || []);
    const [count, setCount] = useState<number>(sum || 0);
    const [location, setLocation] = useState<string | null>(null);
    const [cityIdx, setCityIdx] = useState<number>(-1);

    const findCityIdx = () => clickData.findIndex(row => row.location === location);

    const handleClick = async () => {
        // API call to increment click count
        const res = await fetch("/api/clicks", {
            method: "POST",
            body: JSON.stringify({ location }),
        });
        const count = await res.json();

        // Update total click count
        setCount(count);

        if (cityIdx === -1 && location) {
            // If location doesn't exist, add it
            setClickData(clickData.concat({ location, count: 1 }));
        } else {
            // If location exists, increment count for that location
            setClickData(
                clickData.map(row =>
                    row.location === location ? { ...row, count: row.count + 1 } : row
                )
            );
        }
    };

    useEffect(() => {
        // Get user's location
        (async () => {
            const res = await fetch("api/geolocate");
            const { city, region, country } = await res.json();
            setLocation(city && region && country ? `${city}, ${region} - ${country}` : "Unknown");
        })();
    }, [setLocation]);

    useEffect(() => {
        // Find index of location
        setCityIdx(findCityIdx());
    }, [location, clickData, findCityIdx]);

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
                <button onClick={handleClick} disabled={Boolean(!location)}>
                    Click Me
                </button>
                <h2>{`${count} total clicks`}</h2>
                {location ? <h2>{`Your location is ${location}`}</h2> : <h2>Locating...</h2>}
                <table>
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Clicks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clickData
                            .sort((a, b) => {
                                if (a.location.toLowerCase() < b.location.toLowerCase()) return -1;
                                if (a.location.toLowerCase() > b.location.toLowerCase()) return 1;
                                return 0;
                            })
                            .map(row => (
                                <tr key={row.location}>
                                    <td>{row.location}</td>
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
    // TODO: Move this to run on server start
    // Create table if it doesn't exist
    createDB();

    // Get click data from database
    const { rows: data } = await db.query("SELECT * FROM clicks");
    const sum = data.reduce((acc, curr) => acc + curr.count, 0);

    return { props: { data, sum } };
}
