"use client";
// src/app/page.js

// Project: Stock Trading System Simulator
// Display Create Stock Page

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function CreateStock() {
    const [stockticker, setStockTicker] = useState('');
    const [companyname, setCompanyName] = useState(''); // Full name field
    const [dailyvolume, setDailyVolume] = useState(''); // Password field
    const [openprice, setOpenPrice] = useState('');
    const [pricehigh, setPriceHigh] = useState('');
    const [pricelow, setPriceLow] = useState('');
    const [currentprice, setCurrentPrice] = useState('');

    const [stock, setStock] = useState([]); // State to hold user data
    const [error, setError] = useState(""); // State to hold error messages

    // Fetch the data when the component mounts
    const fetchData = async () => {
        try {
            const response = await fetch('/api?resource=stocks');
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
            const res = await fetch('/api?resource=stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stockticker, companyname, currentprice, dailyvolume, openprice, pricehigh, pricelow }),
            });

            if (res.ok) {
                fetchData(); // Refresh the data after adding a new item
                setStockTicker('');
                setCompanyName('');
                setDailyVolume('');
                setOpenPrice('');
                setPriceHigh('');
                setPriceLow('');
                setCurrentPrice('');
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
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <title>Stock Sim | Market</title>
            </Head>
            <div>
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
                        onChange={(e) => setOpenPrice(e.target.value)}
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