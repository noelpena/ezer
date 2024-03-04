import { createSupabaseReqResClient } from "@/utils/supabase";
import type { GetServerSidePropsContext } from "next";
import { Session } from "@supabase/gotrue-js/src/lib/types";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Container } from "@mantine/core";

type AppProps = {
	session: Session | null;
};

const Dashboard = ({ session }: AppProps) => {
	return (
		<>
			<Head>
				<title>Ezer | Dashboard</title>
			</Head>
			<Layout session={session}>
				<Container>
					<p>You are already logged in.</p>
				</Container>
			</Layout>
		</>
	);
};

export default Dashboard;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createSupabaseReqResClient(ctx);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return {
		props: { session },
	};
};
