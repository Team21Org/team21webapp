"use client";
// src/app/page.js

// Project: Stock Trading System Simulator
// Display Create Stock Page

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";

export default function ViewMarket() {

    const [stock, setStock] = useState([]); // State to hold stock data
    const [error, setError] = useState(""); // State to hold error messages

    // Fetch the data when the component mounts
    const fetchData = async () => {
        try {
            const response = await fetch('/api/RoutingTable?resource=stocks');
            if (!response.ok) {
                throw new Error('StockGET request failed');
            }
            const data = await response.json();
            setStock(data);
        } catch (err) {
            console.error('Error fetching stock data:', err);
            setError('Error fetching stock data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Stock Sim | Market</title>
                <link rel="stylesheet" type="text/css" href="capstone.css" />
            </Head>

            <div>
                <div>
                    <Link href="/"> <Image className="banner" src="/LOGOv1.png" alt="Logo" width={160} height={110} /> </Link>
                    <h1>Stock Trading System Simulator</h1>
                    <h2>By Team 21</h2>
                    <h2>Sam Kline, Michael Lacey, Josien Lajoie</h2>
                    <div className="navbar">
                        <Link className="login" href="/login">Log In</Link>
                        <Link href="./schedule">View Schedule</Link>
                        <Link href="./market">View Market</Link>
                        <div className="dropdown">
                            <button className="dropbtn">Account</button>
                            <div className="dropdown-content">
                                <Link href="/Profile">Profile</Link>
                                <Link href="/Profile/portfolio">Portfolio</Link>
                                <Link href="/Profile/portfolio/transaction-history">Transaction History</Link>
                            </div>
                        </div>
                        <div className="dropdown">
                            {/* <!-- check if user is administrator to reveal Hidden attributes --> */}
                            <button hidden className="dropbtn">Edit</button>
                            <div className="dropdown-content">
                                <a href="editmarket.html">Edit Market</a>
                                <a href="editschedule.html">Edit Schedule</a>
                            </div>
                        </div>
                    </div>
                </div>

                <h3>View Market</h3>   

                <div className="w-full max-w-md">
                    {/* Display the fetched data */}
                    <div>
                        
                        <table border="1" cellPadding="8">
                            <thead>
                                <tr>
                                    <th>ID#</th>
                                    <th>Stock Ticker</th>
                                    <th>Company Name</th>
                                    <th>Daily Volume</th>
                                    <th>Open Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stock.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td>{index + 1}</td>
                                        <td>{item.stockticker}</td>
                                        <td>{item.companyname}</td>
                                        <td>{item.dailyvolume}</td>
                                        <td>{item.openprice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
