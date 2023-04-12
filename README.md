# Chasing Clicks

## Software Engineering Super League - Level 1

This is a project for the Software Engineering Super League - Level 1. The goal of this project is to create a web application that tracks the number of clicks on a button. With a bonus objective to display the location of the user and track where each click was from.

## Setup

1.  Clone the repo

    ```bash
    git clone https://github.com/Patricus/chasing-clicks.git
    ```

2.  Install dependencies

    ```bash
    npm install
    ```

3.  Create an account for the geo-location API key at [https://abstractapi.com/](https://app.abstractapi.com/users/signup)

4.  Create a database

    In the psql shell, run the following:

    ```sql
    CREATE DATABASE chasing_clicks;
    ```

    **Note:** You can use any name for the database, but you will need to update the `DATABASE_URL` in the `.env.local` file.

5.  Create a `.env.local` file in the root directory and add the following:

    You can find your `IP_API_KEY` on [app.abstractapi.com/api/ip-geolocation/](https://app.abstractapi.com/api/ip-geolocation).

    ```
    IP_API_KEY=<your api key>
    DATABASE_URL=<your postgres url>
    ```

    **Example:** The `DATABASE_URL` should be in the following format:

    ```bash
    postgres://localhost:5432/chasing_clicks
    ```

6.  **Optional:** You can also add a schema name to the `DATABASE_URL` if you want to use a different schema than the default `public` schema.

    ```bash
    postgres://localhost:5432/chasing_clicks?schema=chasing_clicks
    ```

    **Note:** If you want to use a different schema, you will need to create the schema in the database first.

    ```sql
    CREATE SCHEMA chasing_clicks;
    ```

## Run the app

In the project directory, you can run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

**Location Unknown:** The detected ip address will be your internal ip address. This address cannot be used for geo-location, you should see your location as _Unknown_.

---
