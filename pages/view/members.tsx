import Head from "next/head";

import { Button, SimpleGrid, Table, Title } from "@mantine/core";
import { createSupabaseReqResClient } from "@/utils/supabase";

import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";

import type { GetServerSidePropsContext } from "next/types";
import type { Member, Supabase_Response } from "@/types/models";

import capitalize from "@/utils/capitalize";
import Layout from "@/components/Layout";

import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";

type ViewMemberProps = {
	session: Session;
	member_data: Member[];
	is_active: boolean;
};

export default function ViewMember({
	session,
	member_data,
	is_active,
}: ViewMemberProps) {
	const router = useRouter();

	const rows = member_data.map((member) => {
		if (member.id) {
			return (
				<Table.Tr key={member.id}>
					<Table.Td>{capitalize(member.full_name || "")}</Table.Td>
					<Table.Td>{capitalize(member.display_name || "")}</Table.Td>

					<Table.Td>{member.is_active ? "Yes" : "No"}</Table.Td>
					<Table.Td>
						<Button
							variant="subtle"
							onClick={() => handleMemberEdit(member.id)}
						>
							Edit
						</Button>
					</Table.Td>
				</Table.Tr>
			);
		}
	});

	const handleMemberEdit = (id: string) => {
		router.push(`/edit/member/${id}`);
	};

	return (
		<>
			<Head>
				<title>Ezer | View Members</title>
			</Head>
			<Layout session={session}>
				<div className="h-screen max-w-screen-lg mt-6 mb-12 mx-4">
					<SimpleGrid cols={2} className="mb-4">
						<Title order={2}>
							{is_active ? "Active" : "Inactive"} Members
						</Title>
						{is_active ? (
							<Button
								variant="outline"
								color="yellow"
								onClick={() => {
									router.push(
										"/view/members?is_active=false"
									);
								}}
							>
								View Inactive Members
							</Button>
						) : (
							<Button
								variant="outline"
								color="blue"
								onClick={() => {
									router.push("/view/members");
								}}
							>
								View Active Members
							</Button>
						)}
					</SimpleGrid>
					{member_data.length > 0 ? (
						<>
							<Table striped withTableBorder>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Member Name</Table.Th>
										<Table.Th>Display Name</Table.Th>
										<Table.Th>Active?</Table.Th>
										<Table.Th>Actions</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>{rows}</Table.Tbody>
							</Table>
						</>
					) : (
						<>
							<p className="my-3">
								There are no active members to view.
							</p>

							<Button
								variant="outline"
								color="yellow"
								onClick={() => {
									router.push(
										"/view/members?is_active=false"
									);
								}}
							>
								View Inactive Members
							</Button>
						</>
					)}
				</div>
			</Layout>
		</>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createSupabaseReqResClient(ctx);
	let is_active: boolean = true;

	if (ctx.query.is_active !== undefined && ctx.query.is_active === "false") {
		is_active = false;
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	try {
		const member_res: Supabase_Response<Member> = await supabase
			.from("members")
			.select("*")
			.eq("is_active", is_active)
			.order("full_name", { ascending: true });

		const { data: member_data, error: deposit_error } = member_res;

		return {
			props: { session, member_data, is_active },
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
