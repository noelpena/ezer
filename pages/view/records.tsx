import Head from "next/head";

import {
	Button,
	Flex,
	Pagination,
	Select,
	SimpleGrid,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { createSupabaseReqResClient } from "@/utils/supabase";

import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";

import type { GetServerSidePropsContext } from "next/types";
import type { Record, RecordsView, Supabase_Response } from "@/types/models";

import capitalize from "@/utils/capitalize";
import addCommasToAmount from "@/utils/addCommasToAmount";
import Layout from "@/components/Layout";

import { Session } from "@supabase/supabase-js";
import formatDate from "@/utils/formatDate";
import { useRouter } from "next/router";
import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";

type ViewDepositProps = {
	session: Session;
	record_data: RecordsView[];
};

export default function ViewRecords({
	session,
	record_data,
}: ViewDepositProps) {
	const router = useRouter();

	// const recordsPerPage = 25;
	const [recordsPerPage, setRecordsPerPage] = useState<number>(25);
	const [currentPage, setCurrentPage] = useState(1);

	const startIndex = (currentPage - 1) * recordsPerPage;
	const endIndex = startIndex + recordsPerPage;
	const currentRecords = record_data.slice(startIndex, endIndex);

	const totalPages = Math.ceil(record_data.length / recordsPerPage);
	console.log(totalPages);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// router.push(`/view/records?page=${page}`);
	};

	const rows = currentRecords.map((record) => {
		if (record.amount && record.id) {
			return (
				<Table.Tr key={record.id}>
					<Table.Td>{record.category_name}</Table.Td>
					<Table.Td>{record.member_name}</Table.Td>
					<Table.Td>{record.department_name}</Table.Td>
					<Table.Td>{`$${addCommasToAmount(
						(record.amount / 100).toFixed(2)
					)}`}</Table.Td>
					<Table.Td>
						{capitalize(record.income_expense || "")}
					</Table.Td>
					<Table.Td>{capitalize(record.payment_type || "")}</Table.Td>
					<Table.Td>{formatDate(record.date || "")}</Table.Td>
					<Table.Td>{record.description_notes}</Table.Td>
					<Table.Td>
						<Button
							variant="subtle"
							onClick={() => handleRecordEdit(record.id)}
						>
							Edit
						</Button>
					</Table.Td>
				</Table.Tr>
			);
		}
	});

	const handleRecordEdit = (id: string | null) => {
		if (id !== null) {
			router.push(`/edit/record/${id}`);
		}
	};

	return (
		<>
			<Head>
				<title>Ezer | View Records</title>
			</Head>
			<Layout session={session}>
				<div className="h-screen max-w-screen-lg mt-6 mb-12 mx-4">
					<SimpleGrid cols={2} className="mb-4">
						<Title order={2}>Records List</Title>
						<Button
							className="border-1 !border-green-500"
							variant="light"
							color="green"
							onClick={() => {
								router.reload(); // make this better
							}}
							rightSection={<IconRefresh size={16} />}
						>
							Refresh List
						</Button>
					</SimpleGrid>

					{record_data.length > 0 ? (
						<>
							<Table striped withTableBorder>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Category</Table.Th>
										<Table.Th>Member</Table.Th>
										<Table.Th>Department</Table.Th>
										<Table.Th>Amount</Table.Th>
										<Table.Th>Income/Expense</Table.Th>
										<Table.Th>Payment Type</Table.Th>
										<Table.Th>Date</Table.Th>
										<Table.Th>Notes</Table.Th>
										<Table.Th>Actions</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>{rows}</Table.Tbody>
							</Table>
							<Flex
								justify="space-between"
								className="mb-4 flex items-center bg-neutral-200 p-4"
								direction={{ base: "column", sm: "row" }}
							>
								<div>
									<Text
										size="md"
										className="text-right italic !inline-block"
									>
										Records per page
									</Text>
									<Select
										className="!inline-block w-24 mx-2 md:mb-0 mb-2"
										data={["25", "50", "100"]}
										value={recordsPerPage.toString()}
										//@ts-ignore
										onChange={setRecordsPerPage}
									/>
								</div>
								<Pagination
									className="!inline-block text-right"
									total={totalPages}
									value={currentPage}
									onChange={handlePageChange}
									withEdges
								/>
							</Flex>
						</>
					) : (
						<>
							<p className="my-3">
								There are no records to view.
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
		const currentPage = ctx.query.page
			? parseInt(ctx.query.page as string)
			: 1;
		const recordsPerPage = 50;
		const startIndex = (currentPage - 1) * recordsPerPage;
		console.log(currentPage, startIndex);

		const record_res: Supabase_Response<Record[]> = await supabase
			.from("records_view")
			.select("*")
			.range(0, 1000);
		//.range(startIndex, startIndex + recordsPerPage - 1);
		// .order("date", { ascending: false });

		const { data: record_data, error: record_error } = record_res;

		return {
			props: { session, record_data, is_closed },
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
