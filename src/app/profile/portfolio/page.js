import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";

export default function Portfolio() {
    return (
        <>
            <Head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Stock Sim | Portfolio</title>
            </Head>
            <div>
                <h3>Portfolio</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Stock Name</th>
                            <th>Ticker Number</th>
                            <th>Quantity Owned</th>
                            <th>Purchase Price</th>
                            <th>Purchase Date</th>
                            <th>Daily High</th>
                            <th>Daily Low</th>
                            <th>Opening Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <!-- The table needs to be populated from the database, such as with JavaScript --> */}
                    </tbody>
                </table>
                <p>Account Balance</p>
                {/* <!-- Pull user account balance --> */}
            </div>
        </>
    );
}