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
