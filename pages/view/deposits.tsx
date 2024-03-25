import Head from "next/head";

import { Button, SimpleGrid, Table, Title, Group } from "@mantine/core";
import { createSupabaseReqResClient } from "@/utils/supabase";

import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";

import type { GetServerSidePropsContext } from "next/types";
import type { Deposit, Supabase_Response } from "@/types/models";

import capitalize from "@/utils/capitalize";
import addCommasToAmount from "@/utils/addCommasToAmount";
import Layout from "@/components/Layout";

import { Session } from "@supabase/supabase-js";
import formatDate from "@/utils/formatDate";
import { useRouter } from "next/router";
import { IconFilePlus } from "@tabler/icons-react";

type ViewDepositProps = {
	session: Session;
	deposit_data: Deposit[];
	is_closed: boolean;
};

export default function ViewDeposit({
	session,
	deposit_data,
	is_closed,
}: ViewDepositProps) {
	const router = useRouter();

	const rows = deposit_data.map((deposit) => (
		<Table.Tr key={deposit.id}>
			<Table.Td>{capitalize(deposit.deposit_type)}</Table.Td>
			<Table.Td>{formatDate(deposit.deposit_date)}</Table.Td>
			<Table.Td>
				${addCommasToAmount((deposit.amount / 100).toFixed(2))}
			</Table.Td>
			<Table.Td>{deposit.notes}</Table.Td>
			<Table.Td>{deposit.is_closed ? "Yes" : "No"}</Table.Td>
			<Table.Td>
				<Button
					variant="subtle"
					onClick={() => handleDepositEdit(deposit.id)}
				>
					Edit
				</Button>
			</Table.Td>
		</Table.Tr>
	));

	const handleDepositEdit = (id: string) => {
		router.push(`/edit/deposit/${id}`);
	};

	return (
		<>
			<Head>
				<title>Ezer | View Deposits</title>
			</Head>
			<Layout session={session}>
				<div className="h-screen max-w-screen-lg mt-6 mb-12 mx-4">
					<SimpleGrid cols={2} className="mb-4">
						<Title order={2}>
							{is_closed ? "Closed" : "Open"} Deposits
						</Title>
						{is_closed ? (
							<Group justify="flex-end">
								<Button
									rightSection={<IconFilePlus size={14} />}
									variant="outline"
									color="green"
									onClick={() => {
										router.push("/new/deposit");
									}}
								>
									Add New Deposit
								</Button>

								<Button
									variant="outline"
									color="blue"
									onClick={() => {
										router.push("/view/deposits");
									}}
								>
									View Open Deposits
								</Button>
							</Group>
						) : (
							<Group justify="flex-end">
								<Button
									rightSection={<IconFilePlus size={14} />}
									variant="outline"
									color="green"
									onClick={() => {
										router.push("/new/deposit");
									}}
								>
									Add New Deposit
								</Button>
								<Button
									variant="outline"
									color="yellow"
									onClick={() => {
										router.push(
											"/view/deposits?is_closed=true"
										);
									}}
								>
									View Closed Deposits
								</Button>
							</Group>
						)}
					</SimpleGrid>
					{deposit_data.length > 0 ? (
						<>
							<Table striped withTableBorder>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Deposit Type</Table.Th>
										<Table.Th>Date</Table.Th>
										<Table.Th>Amount</Table.Th>
										<Table.Th>Notes</Table.Th>
										<Table.Th>Closed?</Table.Th>
										<Table.Th>Actions</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>{rows}</Table.Tbody>
							</Table>
						</>
					) : (
						<>
							<p className="my-3">
								There are no open deposits to view.
							</p>
						</>
					)}
				</div>
			</Layout>
		</>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createSupabaseReqResClient(ctx);
	let is_closed: boolean = false;

	if (ctx.query.is_closed !== undefined && ctx.query.is_closed === "true") {
		is_closed = true;
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	try {
		const deposit_res: Supabase_Response<Deposit[]> = await supabase
			.from("deposits")
			.select("*")
			.eq("is_closed", is_closed)
			.order("deposit_date", { ascending: false });

		const { data: deposit_data, error: deposit_error } = deposit_res;

		return {
			props: { session, deposit_data, is_closed },
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
