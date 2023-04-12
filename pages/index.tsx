import { useEffect, useState } from "react";
import { Pool } from "pg";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

type Data = {
    city: string;
    count: number;
};

export default function Home({ data, sum }: { data: Data[]; sum: number }) {
    const [count, setCount] = useState<number>(sum || 0);
    const [city, setCity] = useState<string | null>(null);
    const [cityIdx, setCityIdx] = useState<number>(-1);

    const handleClick = async () => {
        const res = await fetch("/api/clicks", {
            method: "POST",
            body: JSON.stringify({ city }),
        });
        const count = await res.json();
        setCount(count);

        const findCityIdx = () => data.findIndex(row => row.city === city);

        if (findCityIdx() === -1 && city) {
            data.push({ city, count: 1 });
            setCityIdx(findCityIdx());
            console.log("cityIdx", cityIdx);
        } else {
            data[cityIdx].count += 1;
        }
    };

    useEffect(() => {
        (async () => {
            const res = await fetch("api/geolocate");
            const { city } = await res.json();
            setCity(city || "Unknown");
        })();
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
                <input
                    type="text"
                    value={city || ""}
                    onChange={e => setCity(e.target.value)}
                />{" "}
                {/* Input for testing purposes only
                TODO: delete when done testing */}
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
                        {data
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
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const { rows: data } = await pool.query("SELECT * FROM clicks");
    const sum = data.reduce((acc, curr) => acc + curr.count, 0);

    return { props: { data, sum } };
}
