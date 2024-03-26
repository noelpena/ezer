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
import {
	Anchor,
	Text,
	Button,
	Checkbox,
	Container,
	Group,
	Paper,
	PasswordInput,
	TextInput,
	Title,
} from "@mantine/core";

type AppProps = {
	session: Session | null;
};

const Login = ({ session }: AppProps) => {
	const [sesh, setSesh] = useState(session);

	const supabase = createSupabaseFrontendClient();

	// const signIn = async () => {
	// 	const { error } = await supabase.auth.signInWithPassword({
	// 		email: "noelp.wd@gmail.com",
	// 		password: "passpass",
	// 	});

	// 	const {
	// 		//@ts-ignore
	// 		data: { newSesh },
	// 	} = await supabase.auth.getSession();
	// 	setSesh(newSesh);
	// };

	// const signUp = async (event: any) => {
	// 	const formData = new FormData(event.target);
	// 	const email = formData.get("email") as string;
	// 	const password = formData.get("password") as string;

	// 	const { error } = await supabase.auth.signUp({
	// 		email: "noelp.wd+testingsupabase@gmail.com",
	// 		password: "passpass",
	// 		options: {
	// 			emailRedirectTo: `${location.origin}/auth/callback`,
	// 		},
	// 	});

	// 	if (error) {
	// 		return redirect("/login?message=Could not authenticate user");
	// 	}

	// 	return redirect(
	// 		"/login?message=Check email to continue sign in process"
	// 	);
	// };

	const signOut = async () => {
		await supabase.auth.signOut();
		setSesh(null);
	};

	return (
		<Container size={420} my={40}>
			<Title
				ta="center"
				style={{
					fontFamily: "Greycliff CF, sans-serif",
					fontWeight: 900,
				}}
			>
				Welcome back!
			</Title>

			<Paper withBorder shadow="md" p={30} mt={15} radius="md">
				<TextInput
					label="Email address"
					placeholder="you@mantine.dev"
					required
				/>
				<PasswordInput
					label="Password"
					placeholder="Your password"
					required
					mt="md"
				/>
				<Group justify="space-between" mt="lg">
					{/* <Checkbox label="Remember me" /> */}
					{/* <Anchor component="button" size="sm">
						Forgot password?
					</Anchor> */}
				</Group>
				<Button fullWidth mt="sm">
					Sign in
				</Button>
			</Paper>
		</Container>
	);
};

export default Login;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createSupabaseReqResClient(ctx);
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	var sesh: Session | null = null;
	if (user) {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		sesh = session;
	}

	console.log(sesh);

	return {
		props: { sesh },
	};
};
