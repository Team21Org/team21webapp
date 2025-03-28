"use client";
// src/app/signup/page.js
//This is the user registration portal

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";



export default function SignUp() {
    const [email, setEmail] = useState('');
    const [fullname, setFullName] = useState(''); // Full name field
    const [pword, setPWord] = useState(''); // Password field
    const [username, setUsername] = useState('');
    const [accesslevel, setAccessLevel] = useState(''); // Access level field

    const [users, setUsers] = useState([]); // State to hold user data
    const [error, setError] = useState(""); // State to hold error messages

    // Fetch the data when the component mounts
    const fetchData = async () => {
        try {
            const response = await fetch('/api?resource=user');
            if (!response.ok) {
                throw new Error('UserGET request failed');
            }
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Error fetching user data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    // Function to handle form submission for adding items
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api?resource=user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, fullname, pword, username, accesslevel }),
            });


            if (res.ok) {
                fetchData(); // Refresh the data after adding a new item
                setEmail('');
                setFullName('');
                setPWord('');
                setUsername('');
                setAccessLevel('');
                console.log('Item added successfully');
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
                <title>Stock Sim | Sign-Up</title>
            </Head>
            <div>
                <h3>Sign-Up</h3>
                {/* Form to add new items */}
                <form onSubmit={handleSubmit} className="mb-6 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullname}
                        onChange={(e) => setFullName(e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="password"
                        value={pword}
                        onChange={(e) => setPWord(e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        <h2>User List</h2>
                        <table border="1" cellPadding="8">
                            <thead>
                                <tr>
                                    <th>ID#</th>
                                    <th>Email</th>
                                    <th>Full Name</th>
                                    <th>Password</th>
                                    <th>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td>{index + 1}</td>
                                        <td>{item.email}</td>
                                        <td>{item.fullname}</td>
                                        <td>{item.pword}</td>
                                        <td>{item.username}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* <!-- this needs to have JavaScript code to verify login information with the database, and then to redirect to likely profile.html --> */}
            </div>
        </>
    );
}
