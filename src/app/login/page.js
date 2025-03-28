import Image from "next/image"
import Head from "next/head";
import Link from "next/link";

export default function Login() {
	return (
		<div>
			<Head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta http-equiv="X-UA-Compatible" content="ie=edge" />
				<title>Stock Sim | Login</title>
			</Head>
			<h3>Login</h3>

			<form id="loginform">
				<label htmlFor="username">Username:</label><br />
				<input type="text" id="username" name="username" /><br />
				<label htmlFor="pwd">Password:</label><br />
				<input type="password" id="pwd" name="pwd" /><br /><br />
				<input className="btn" type="submit" value="Submit" /><br /><br />
				<Link id="accbtn" href="/signup"> No Account? Make One Here! </Link>
			</form>
			{/* <!-- this needs to have JavaScript code to verify login information with the database, and then to redirect to likely profile.html --> */}
		</div>
	);
}