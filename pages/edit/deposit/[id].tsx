import Layout from "@/components/Layout";
import { Deposit, Supabase_Response } from "@/types/models";
import { createSupabaseReqResClient } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";

type EditDepositProps = {
	session: Session;
	deposit_data: Deposit[];
};

export default function EditDeposit({
	session,
	deposit_data,
}: EditDepositProps) {
	return (
		<>
			<Head>
				<title>Ezer | New Deposit</title>
			</Head>
			<Layout session={session}>
				<div>deposit</div>
				{JSON.stringify(deposit_data)}
			</Layout>
		</>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { id } = ctx.query;
	const supabase = createSupabaseReqResClient(ctx);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	try {
		const [deposit_res]: [Supabase_Response<Deposit>] = await Promise.all([
			supabase.from("deposits").select("*").eq("id", id),
		]);

		const { data: deposit_data, error: deposit_error } = deposit_res;

		return {
			props: { session, deposit_data },
		};
	} catch (error) {
		console.error(
			"An error occurred while fetching data from the database:",
			error
		);

		return {
			props: {
				error: "An error occurred while fetching data from the database.",
			},
		};
	}
};
