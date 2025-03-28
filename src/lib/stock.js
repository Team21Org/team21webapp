import { pool } from "@lib/db.js";
import { NextResponse } from "next/server";

// Handler to fetch user data
export async function getStockData() {
    try {
        const { rows } = await pool.query("SELECT stockticker AS stockticker, companyname, currentprice, dailyvolume, openprice, pricehigh, pricelow FROM simstockdb.stock");
        return rows;
    } catch (err) {
        console.error("Error retrieving stock data:", err);
        throw new Error("Error retrieving stock data");
    }
}

// Handler to add a new user
export async function addStock(req) {
    try {
        const { stockticker, companyname, currentprice = 0, dailyvolume = 0, openprice = 0 , pricehigh = 0, pricelow = 0 } = await req.json();

        if (!stockticker || !companyname || !dailyvolume || !openprice) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check if a record with the same email or username already exists
        const checkQuery = "SELECT * FROM simstockdb.stock WHERE stockticker = $1";
        const checkResult = await pool.query(checkQuery, [stockticker]);

        if (checkResult.rows.length > 0) {
            return NextResponse.json({ error: "Given stock ticker already exists" }, { status: 409 });
        }

        // Insert the new record if no conflict is found
        const insertQuery = "INSERT INTO simstockdb.stock (stockticker, companyname, currentprice, dailyvolume, openprice, pricehigh, pricelow) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        const insertResult = await pool.query(insertQuery, [stockticker, companyname, currentprice, dailyvolume, openprice, pricehigh, pricelow]);

        return NextResponse.json(insertResult.rows[0]);
    } catch (err) {
        console.error("Error adding stock data:", err);
        return NextResponse.json({ error: "Error adding stock data" }, { status: 500 });
    }
}