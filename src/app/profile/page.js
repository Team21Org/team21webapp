import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";

export default function Profile() {
    return (
        <>
            <Head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Stock Sim | Profile</title>
            </Head>
            <div>
                <div>
                </div>
                <h3>Profile</h3>
                <p>Name: </p>
                <p>Username: </p>
                <p>E-Mail Address:</p>
                <p>Account Number: </p>
                <p>Account Balance: </p>
                {/* <!--javascript to pull user information from the database. Organize into table, maybe --> */}
            </div>
        </>
    );
}