import { pool } from "./db.js";
import { NextResponse } from "next/server";


// Handler to fetch user data
export async function getUserData() {
    try {
        const { rows } = await pool.query("SELECT userid AS id, email, fullname, pword, username, accesslevel FROM simstockdb.user");
        return rows;
    } catch (err) {
        console.error("Error retrieving user data:", err);
        throw new Error("Error retrieving user data");
    }
}

// Handler to add a new user
export async function addUser(req) {
    try {
        const { email, fullname, pword, username, accesslevel } = await req.json();

        if (!email || !fullname || !pword || !username) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check if a record with the same email or username already exists
        const checkQuery = "SELECT * FROM simstockdb.user WHERE email = $1 OR username = $2";
        const checkResult = await pool.query(checkQuery, [email, username]);

        if (checkResult.rows.length > 0) {
            return NextResponse.json({ error: "A user with the same email or username already exists" }, { status: 409 });
        }

        // Insert the new record if no conflict is found
        const insertQuery = "INSERT INTO simstockdb.user (email, fullname, pword, username) VALUES ($1, $2, $3, $4) RETURNING *";
        const insertResult = await pool.query(insertQuery, [email, fullname, pword, username]);

        return NextResponse.json(insertResult.rows[0]);
    } catch (err) {
        console.error("Error adding user data:", err);
        return NextResponse.json({ error: "Error adding user data" }, { status: 500 });
    }
}