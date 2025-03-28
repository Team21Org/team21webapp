import { NextResponse } from "next/server";
import { getUserData, addUser } from "@lib/user.js";
import { getStockData, addStock } from "@lib/stock.js";

// This script handles the API routing for the stock trading system simulator.
export const dynamic = "force-static";
export const revalidate = 1;


// Main handler to route GET requests
export async function GET(req) {
    const url = new URL(req.url);
    const resource = url.searchParams.get("resource");

    if (!resource) {
        return NextResponse.json({ error: "Resource not specified" }, { status: 400 });
    }

    let data;
    try {
        switch (resource) {
            case "user":
                data = await getUserData();
                break;
            case "stock":
                data = await getStockData();
                break;
            default:
                return NextResponse.json({ error: "Invalid resource" }, { status: 404 });
        }

        console.log("Fetched data:", data);
        return NextResponse.json(data);
    } catch (err) {
        console.error("Error retrieving data:", err);
        return NextResponse.json({ error: "Error retrieving data" }, { status: 500 });
    }
}

// Main handler to route POST requests
export async function POST(req) {
    const url = new URL(req.url);
    const resource = url.searchParams.get("resource");

    if  (!resource) {
        return NextResponse.json({ error: "Resource not specified" }, { status: 400 });
    }

    try {
        let result;

        switch (resource) {
            case "user":
                result = await addUser(req);
                break;
            case "stock":
                result = await addStock(req);
                break;
            default:
                return NextResponse.json({ error: "Invalid resource" }, { status: 404 });
        }

        console.log("Fetched Data", result);
        return NextResponse.json(result);
    } catch (err) {
        console.error(`Error handling POST for resource "${resource}":`, err);
        return NextResponse.json({ error: "Error handling POST request" }, { status: 500 });
    }
}
