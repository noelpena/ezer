import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import {
	createSupabaseFrontendClient,
	createSupabaseReqResClient,
} from "@/utils/supabase";
import type { GetServerSidePropsContext } from "next";
import { Session } from "@supabase/gotrue-js/src/lib/types";
import { Title } from "@mantine/core";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

type AppProps = {
	session: Session | null;
};

const Home = ({ session }: AppProps) => {
	const router = useRouter();
	const [sesh, setSesh] = useState(session);
	const supabase = createSupabaseFrontendClient();

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange(
			(event, newSession) => {
				if (event == "PASSWORD_RECOVERY") {
					router.push("/passwordreset");
				}

				if (event == "SIGNED_IN") {
					router.push("/dashboard");
					// setSesh(newSession);
					console.log("SIGNED IN");
				}
			}
		);

		return () => {
			data.subscription.unsubscribe();
		};
	});

	return (
		<>
			<Head>
				<title>Ezer | Login</title>
			</Head>

			{sesh == null ? (
				<>
					<main
						id="main"
						className={`min-h-screen items-center p-12 ${inter.className}`}
					>
						{/* <h1>Ezer Login</h1> */}
						<Title order={1}>Ezer Login</Title>
						<Auth
							supabaseClient={supabase}
							appearance={{ theme: ThemeSupa }}
							// theme="dark"
							// providers={["google"]}
							providers={[]}
							showLinks={false}
						/>
					</main>
				</>
			) : (
				<Layout session={sesh}>
					<p>You are already logged in.</p>
				</Layout>
			)}
		</>
	);
};

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createSupabaseReqResClient(ctx);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return {
		props: { session },
	};
};
