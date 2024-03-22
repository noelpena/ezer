import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
	createSupabaseFrontendClient,
	createSupabaseReqResClient,
} from "@/utils/supabase";
import { Container, Select, Table } from "@mantine/core";
import { Session } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next/types";
import { Member, Record, Supabase_Response } from "@/types/models";
import addCommasToAmount from "@/utils/addCommasToAmount";
import formatDate from "@/utils/formatDate";
import capitalize from "@/utils/capitalize";

type mantineSelectData = {
	value: string;
	label: string;
};
type AppProps = {
	session: Session | null;
	member_data: Member[];
};

export default function Diezmo({ session, member_data }: AppProps) {
	const [selectMember, setSelectedMember] = useState<string>("");
	const [diezmos, setDiezmos] = useState<Record[]>([]);
	const [total, setTotal] = useState<number>(0);
	const supabase = createSupabaseFrontendClient();

	function member_names(member_data: Member[]) {
		if (!member_data) {
			return [];
		}

		const extractNames: mantineSelectData[] = member_data.map(
			(member: Member) => {
				return {
					value: member.id as string,
					label: member.full_name as string,
				};
			}
		);
		return extractNames;
	}

	useEffect(() => {
		getDiezmos();
	}, [selectMember]);

	const getDiezmos = async () => {
		const { data, error } = await supabase.rpc("get_member_diezmos", {
			member_id: selectMember,
		});
		if (data) {
			setDiezmos(data);
			let diezmoTotal = 0;
			data.map((record) => {
				if (record.amount) {
					diezmoTotal += record.amount;
				}
			});
			setTotal(diezmoTotal / 100);
		}
	};

	const handleMemberChange = (value: string | null) => {
		if (value) {
			setSelectedMember(value);
		}
	};

	const rows = diezmos.map((record) => {
		if (record.amount && record.id) {
			// setTotal((prevTotal) => {
			// 	return prevTotal + record.amount;
			// });
			return (
				<Table.Tr key={record.id}>
					<Table.Td>{`$${addCommasToAmount(
						(record.amount / 100).toFixed(2)
					)}`}</Table.Td>

					<Table.Td>{formatDate(record.date || "")}</Table.Td>
					<Table.Td>{capitalize(record.payment_type || "")}</Table.Td>
				</Table.Tr>
			);
		}
	});

	return (
		<>
			<Head>
				<title>Ezer | Diezmo Report</title>
			</Head>
			<Layout session={session}>
				<Container>
					<Select
						size="lg"
						label="Select Member"
						data={member_names(member_data)}
						onChange={handleMemberChange}
						placeholder="Search or scroll down the list to select a member"
						searchable
					></Select>
					{diezmos.length > 0 ? (
						<>
							<Table striped withTableBorder className="mt-4">
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Amount</Table.Th>
										<Table.Th>Date</Table.Th>
										<Table.Th>Payment Type</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>{rows}</Table.Tbody>
							</Table>
							<div className="bg-gray-200 p-3">
								Total: ${addCommasToAmount(total.toFixed(2))}
							</div>
						</>
					) : (
						<p className="mt-4">
							No diezmos found for the selected member.
						</p>
					)}
				</Container>
			</Layout>
		</>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createSupabaseReqResClient(ctx);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	try {
		const member_res: Supabase_Response<Member> = await supabase
			.from("members")
			.select("*")
			.eq("is_active", "true")
			.order("full_name", { ascending: true });

		const { data: member_data, error: member_error } = member_res;

		return {
			props: { session, member_data },
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
