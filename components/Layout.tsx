import React, { MouseEventHandler, ReactNode, useEffect } from "react";
import HeaderMenu from "./HeaderMenu";
import { createSupabaseFrontendClient } from "@/utils/supabase";
import { Session } from "@supabase/gotrue-js/src/lib/types";
import router from "next/router";

type AppProps = {
	children: ReactNode;
	session: Session | null;
};

export default function Layout({ children, session }: AppProps) {
	const supabase = createSupabaseFrontendClient();

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange(
			(event, newSession) => {
				if (event == "SIGNED_OUT") {
					router.push("/");
				}
			}
		);

		return () => {
			data.subscription.unsubscribe();
		};
	});

	return (
		<>
			<HeaderMenu
				isLoggedIn={session ? true : false}
				handleSignOut={signOut}
			/>
			<main className="max-w-screen-lg mx-auto">{children}</main>
		</>
	);
}
