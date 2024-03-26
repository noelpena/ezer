import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Auth, MagicLink, VerifyOtp } from "@supabase/auth-ui-react";
import { ThemeSupa, ThemeMinimal, ViewType } from "@supabase/auth-ui-shared";

import {
	createSupabaseFrontendClient,
	createSupabaseReqResClient,
} from "@/utils/supabase";
import type { GetServerSidePropsContext } from "next";
import { Session } from "@supabase/gotrue-js/src/lib/types";
import { Container, Text, Title } from "@mantine/core";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

type AppProps = {
	session: Session | null;
	auth_view: ViewType;
};

const Home = ({ session, auth_view }: AppProps) => {
	const router = useRouter();
	const [sesh, setSesh] = useState(session);
	const [authView, setAuthView] = useState<ViewType>(auth_view);
	const supabase = createSupabaseFrontendClient();

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange(
			(event, newSession) => {
				if (event == "PASSWORD_RECOVERY") {
					router.push("/passwordreset");
				}

				if (event == "SIGNED_IN") {
					// router.push("/dashboard");
					router.push("/view/records");
					// setSesh(newSession);
					console.log("SIGNED IN");
				}
			}
		);

		return () => {
			data.subscription.unsubscribe();
		};
	});

	const changeAuth = (val: ViewType) => {
		setAuthView(val);
	};

	return (
		<>
			<Head>
				<title>Ezer | Login</title>
			</Head>

			{sesh == null ? (
				<>
					<main
						id="main"
						className={`min-h-screen items-center md:p-12 ${inter.className}`}
					>
						<Container>
							<Title order={1}>Ezer Login</Title>

							<Auth
								supabaseClient={supabase}
								appearance={{ theme: ThemeSupa }}
								// theme="dark"
								// providers={["google"]}
								providers={[]}
								showLinks={false}
								view={authView}
								redirectTo="/api/auth/callback"
								localization={{
									variables: {
										magic_link: {
											button_label:
												"Send login link to your email address",
											loading_button_label:
												"Sending login link...",
										},
										verify_otp: {
											button_label: " Verify login code",
											token_input_label: "Login code",
											token_input_placeholder:
												"Your login code",
										},
									},
								}}
							/>
							{authView == "sign_in" && (
								<Text
									className="text-center text-stone-500"
									size="sm"
								>
									Having trouble logging in?{" "}
									<a
										onClick={() => changeAuth("magic_link")}
										className="cursor-pointer text-blue-500"
									>
										Send login link to your email address
									</a>
								</Text>
							)}

							{authView == "magic_link" && (
								<Text
									className="text-center text-stone-500"
									size="sm"
								>
									<a
										onClick={() => changeAuth("sign_in")}
										className="cursor-pointer text-blue-500"
									>
										Login using email and password
									</a>
								</Text>
							)}

							{authView == "verify_otp" && (
								<Text
									className="text-center text-stone-500"
									size="sm"
								>
									<a
										onClick={() => {
											changeAuth("sign_in");
											router.push("/");
										}}
										className="cursor-pointer text-blue-500"
									>
										Login using email and password
									</a>
								</Text>
							)}
						</Container>
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
	const auth_view = ctx.query.view || "sign_in";

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return {
		props: { session, auth_view },
	};
};
