import {
	createSupabaseFrontendClient,
	createSupabaseReqResClient,
} from "@/utils/supabase";
import { redirect } from "next/navigation";
import type { GetServerSidePropsContext } from "next";

import { Auth } from "@supabase/auth-ui-react";
import {
	// Import predefined theme
	ThemeSupa,
} from "@supabase/auth-ui-shared";
import { Session } from "@supabase/gotrue-js/src/lib/types";
import { useState } from "react";

type AppProps = {
	session: Session | null;
};

const Login = ({ session }: AppProps) => {
	const [sesh, setSesh] = useState(session);

	const supabase = createSupabaseFrontendClient();

	const signIn = async () => {
		const { error } = await supabase.auth.signInWithPassword({
			email: "noelp.wd@gmail.com",
			password: "passpass",
		});

		const {
			//@ts-ignore
			data: { newSesh },
		} = await supabase.auth.getSession();
		setSesh(newSesh);
	};

	const signUp = async (event: any) => {
		const formData = new FormData(event.target);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		const { error } = await supabase.auth.signUp({
			email: "noelp.wd+testingsupabase@gmail.com",
			password: "passpass",
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`,
			},
		});

		if (error) {
			return redirect("/login?message=Could not authenticate user");
		}

		return redirect(
			"/login?message=Check email to continue sign in process"
		);
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		setSesh(null);
	};

	return (
		<>
			<Auth
				supabaseClient={supabase}
				appearance={{ theme: ThemeSupa }}
				theme="dark"
				providers={[]}
				showLinks={false}
			/>
			<button onClick={signIn}>SIGN IN</button>
			<br></br>
			<button onClick={signOut}>SIGNOUT</button>
			<br />
			<br />
			{sesh !== null ? "I'm logged in" : "Not logged in"}
		</>
	);

	// return (
	// 	<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 h-screen">
	// 		<button onClick={signIn}>SIGN IN</button>
	// 		<button onClick={signOut}>SIGNOUT</button>
	// 		<Link
	// 			href="/"
	// 			className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
	// 		>
	// 			<svg
	// 				xmlns="http://www.w3.org/2000/svg"
	// 				width="24"
	// 				height="24"
	// 				viewBox="0 0 24 24"
	// 				fill="none"
	// 				stroke="currentColor"
	// 				strokeWidth="2"
	// 				strokeLinecap="round"
	// 				strokeLinejoin="round"
	// 				className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
	// 			>
	// 				<polyline points="15 18 9 12 15 6" />
	// 			</svg>{" "}
	// 			Back
	// 		</Link>

	// 		<form
	// 			className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
	// 			onSubmit={signIn}
	// 		>
	// 			<label className="text-md" htmlFor="email">
	// 				Email
	// 			</label>
	// 			<input
	// 				className="rounded-md px-4 py-2 bg-inherit border mb-6"
	// 				name="email"
	// 				placeholder="you@example.com"
	// 				required
	// 			/>
	// 			<label className="text-md" htmlFor="password">
	// 				Password
	// 			</label>
	// 			<input
	// 				className="rounded-md px-4 py-2 bg-inherit border mb-6"
	// 				type="password"
	// 				name="password"
	// 				placeholder="••••••••"
	// 				required
	// 			/>
	// 			<button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
	// 				Sign In
	// 			</button>
	// 			<button
	// 				onClick={signUp}
	// 				className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
	// 			>
	// 				Sign Up
	// 			</button>
	// 		</form>
	// 	</div>
	// );
};

export default Login;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createSupabaseReqResClient(ctx);
	// // Check if we have a user
	// const {
	// 	data: { user },
	// } = await supabase.auth.getUser();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// let { data: departments, error } = await supabase
	// 	.from("departments")
	// 	.select("*");

	console.log(session);

	// // if (!user)
	// // 	return {
	// // 		redirect: {
	// // 			destination: "/",
	// // 			permanent: false,
	// // 		},
	// // 	};

	return {
		props: { session },
	};
};
