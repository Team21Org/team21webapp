"use client";
// src/app/page.js

// Project: Stock Trading System Simulator
// Display Create Stock Page

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";

export default function CreateStock() {
    const [stockticker, setStockTicker] = useState(''); // Stock ticker field
    const [companyname, setCompanyName] = useState(''); // Company name field
    const [currentprice, setCurrentPrice] = useState(''); // Current price field
    const [dailyvolume, setDailyVolume] = useState(''); // Daily volume field
    const [openprice, setOpenPrice] = useState(''); // Open price field
    const [pricehigh, setPriceHigh] = useState(''); // Price high field
    const [pricelow, setPriceLow] = useState(''); // Price low field

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


    // Function to handle form submission for adding items
    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentprice = openprice;
        const pricehigh = openprice;
        const pricelow = openprice;

        try {
            const res = await fetch('/api/RoutingTable?resource=stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stockticker, companyname, dailyvolume, currentprice, openprice, pricehigh, pricelow }),  
            });


            if (res.ok) {
                fetchData(); // Refresh the data after adding a new item
                setStockTicker('');
                setCompanyName('');
                setDailyVolume('');
                setOpenPrice('');
                setCurrentPrice('');  
                setPriceHigh('');
                setPriceLow('');
            } else {
                console.error('Failed to add item');
            }
        } catch (err) {
            console.error('Error adding item:', err);
        }
    };

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



                <h3>Create Stock</h3>   
                <form onSubmit={handleSubmit} className="mb-6 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Stock Ticker"
                        value={stockticker}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase(); // Convert to uppercase
                            if (value.length <= 4) { // Ensure it's less than or equal to 4 characters
                                setStockTicker(value);
                            } else {
                                setError("Stock Ticker must be 4 characters or less");
                            }
                        }}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={companyname}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Daily Volume"
                        value={dailyvolume}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value >= 0 && Number.isInteger(Number(value))) { // Ensure it's a positive integer
                                setDailyVolume(value);
                            } else {
                                setError("Daily Volume must be a positive integer");
                            }
                        }}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Open Price"
                        value={openprice}
                        onChange={(e) => {
                            const value = e.target.value;
                            const decimal = parseFloat(value).toFixed(2);
                            if (decimal > 0) {
                                setOpenPrice(decimal); // Ensure it's a positive number with 2 decimal places
                            } else {
                                setError("Open Price must be a positive number");
                            }
                        }}
                        className="border p-2 mb-4 w-full"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Item
                    </button>
                </form>
             

                <div className="w-full max-w-md">
                    {/* Display the fetched data */}
                    <div>
                        <h2>Stock List</h2>
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
