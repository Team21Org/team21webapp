"use client";
// This is the main page of the SimStock application

import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function Index() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Stock Sim | Home Page</title>
      </Head>
      <h3>Home</h3>
      <h4>Welcome To Sim Stock! Where Simple Investments Score Big</h4>
      <Image id="homeimg" src="/homepage.jpeg" alt="Homepage" width={800} height={600} style={{ width: '40%', height: 'auto' }} />
      <p id="hometxt">
        Sim Stock is your one-stop shop for all of your investment needs, offering an intuitive and ideal platform for managing your portfolio whenever needed and interacting
        with the market during active hours. With our solution, you will be able to track all of your transactions on the market, review your stock holdings, and deposit and cash out
        your balance all under one platform! Whether you are a new or experienced trader, Sim Stock holds all of the tools that will ensure your financial success and build confidence
        to navigate the market efficiently with its user-friendly interface.
      </p>
      <h4 id="h4alt1">Ready To Start? </h4>
      <Image id="homeimg2" src="/profileicon.png" alt="Profile Icon" width={63} height={63} />
      <Link href="/signup"> <h4 id="h4alt2"> Sign Up For Free!</h4></Link>
      <Image id="homeimg3" src="/stockicon.png" alt="Stock Icon" width={63} height={63} />
      <Link href="/Profile/market"> <h4 id="h4alt2"> View Our Current Market</h4></Link>
    </>
  );
}
