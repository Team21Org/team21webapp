import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";

export default function TransactionHistory() {
    return (
        <>
            <Head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Stock Sim | Transaction History</title>
            </Head>
            <div>
                <h3>Transaction History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Transaction Type</th>
                            <th>Amount</th>
                            <th>Ticker Number</th>
                            <th>Quantity</th>
                            <th>Transaction Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <!-- The table needs to be populated from the database, such as with JavaScript --> */}
                    </tbody>
                </table>
                <p>Balance as of {/* <!-- script for pulling the date --> */}</p>
                <div>
                    <Link className="btn" href="./balance">Access Balance</Link>
                </div>
            </div>
        </>
    );
}