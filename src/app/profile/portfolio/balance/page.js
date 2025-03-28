import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function accountbalance() {
    return (
        <>
            <Head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Stock Sim | Balance</title>
            </Head>
            <div>
                <h3>Balance</h3>
                <p>What would you like to do?</p>
                <form>
                    <input type="radio" id="withdraw" name="balance" value="withdraw" />
                    <label htmlFor="withdraw">Withdraw</label><br />
                    <input type="radio" id="deposit" name="balance" value="deposit" />
                    <label htmlFor="deposit">Deposit</label><br />
                </form>
                <p>Amount: </p>
                <form>
                    <input type="text" id="amount" name="amount" />
                    {/* <!-- verify that input is a double --> */}
                </form>
                <br />
                <input className="btn" type="submit" value="Submit" />
                {/* <!-- JavaScript to add input balance to the account. Maybe a popup displaying success or something --> */}
            </div>
        </>
    );
}