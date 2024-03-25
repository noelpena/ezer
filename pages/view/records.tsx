import Head from "next/head";

import {
	Button,
	Flex,
	Grid,
	Group,
	Pagination,
	Select,
	Table,
	Text,
	Title,
} from "@mantine/core";
import {
	createSupabaseFrontendClient,
	createSupabaseReqResClient,
} from "@/utils/supabase";

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
import { IconRefresh, IconUserPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { showToast, updateToast } from "@/utils/notification";

type ViewDepositProps = {
	session: Session;
	record_data: RecordsView[];
	records_per_page: number;
};

export default function ViewRecords({
	session,
	record_data,
	records_per_page,
}: ViewDepositProps) {
	const router = useRouter();
	const { query } = router;
	const supabase = createSupabaseFrontendClient();

	const [recordData, setRecordData] = useState(() => {
		const newRecordData = [];
		newRecordData[0] = record_data;
		return newRecordData;
	});

	const [recordsPerPage, setRecordsPerPage] =
		useState<number>(records_per_page);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const currentRecords = recordData[currentPage - 1];

	useEffect(() => {
		async function getRecordCount() {
			const { data, error, count } = await supabase
				.from("records_view")
				.select("*", { count: "exact", head: true });

			if (count) {
				setTotalPages(Math.ceil(count / recordsPerPage));
			}

			if (error) {
				console.error(error);
			}
		}
		getRecordCount();

		handlePageChange(currentPage, recordsPerPage);
	}, [recordsPerPage]);

	async function getRecordsForPage(page: number) {
		const offset = (page - 1) * recordsPerPage;

		const res: Supabase_Response<RecordsView> = await supabase
			.from("records_view")
			.select("*")
			.range(offset, offset + recordsPerPage - 1);

		return { records: res.data, error: res.error };
	}

	const handlePageChange = async (
		page: number,
		numOfRecords: number = recordsPerPage
	) => {
		// add loading
		showToast(
			"loading-page",
			"Loading records...",
			"",
			"blue",
			true,
			false
		);

		if (recordData[page - 1] === undefined) {
			const { records, error } = await getRecordsForPage(page);

			if (records) {
				setRecordData((prevRecordData) => {
					const updatedRecordData = [];
					prevRecordData.map((arrRecord, i) => {
						updatedRecordData[i] = arrRecord;
					});

					updatedRecordData[page - 1] = records;

					return updatedRecordData;
				});
			}
		} else {
			if (numOfRecords !== recordData[page - 1].length) {
				const { records, error } = await getRecordsForPage(page);

				if (records) {
					setRecordData((prevRecordData) => {
						const updatedRecordData = [];
						prevRecordData.map((arrRecord, i) => {
							updatedRecordData[i] = arrRecord;
						});

						updatedRecordData[page - 1] = records;

						return updatedRecordData;
					});
				}
			}
		}
		setCurrentPage(page);
		setTimeout(() => {
			updateToast(
				"loading-page",
				"Finished Loading!",
				"",
				"green",
				false,
				1000
			);
		}, 500);
		// router.push(`/view/records?page=${page}`);
	};

	const handleRecordEdit = (id: string | null) => {
		if (id !== null) {
			router.push(`/edit/record/${id}`);
		}
	};

	const handlePerPageChange = (n: string | null) => {
		if (n) {
			setRecordsPerPage(parseInt(n));
			const newQuery = { ...query, per_page: n };
			const params = new URLSearchParams();

			for (const [key, value] of Object.entries(newQuery)) {
				if (value) {
					params.append(key, value);
				}
			}

			const origin =
				typeof window !== "undefined" ? window.location.origin : "";
			const newUrl = new URL(origin + router.asPath);
			newUrl.search = params.toString();

			router.push(newUrl);
		}
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

	return (
		<>
			<Head>
				<title>Ezer | View Records</title>
			</Head>
			<Layout session={session}>
				<div className="h-screen max-w-screen-lg mt-6 mb-12 mx-4">
					<Grid grow className="mb-4" justify="center">
						<Grid.Col span={{ base: 12, sm: 4 }}>
							<Title
								order={2}
								className="md:text-left text-center"
							>
								Records List
							</Title>
						</Grid.Col>

						<Grid.Col span={{ base: 12, sm: 8 }}>
							<Group className="!justify-center md:!justify-end">
								<Button
									rightSection={<IconUserPlus size={14} />}
									variant="outline"
									color="green"
									onClick={() => {
										router.push("/new/record");
									}}
								>
									Add New Record
								</Button>

								<Button
									variant="outline"
									color="blue"
									onClick={() => {
										router.reload(); // make this better
									}}
									rightSection={<IconRefresh size={16} />}
								>
									Refresh List
								</Button>
							</Group>
						</Grid.Col>
					</Grid>

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
										size="sm"
										className="text-right !inline-block"
									>
										Records per page
									</Text>
									<Select
										className="!inline-block w-24 mx-2 md:mb-0 mb-2"
										data={["25", "50", "100"]}
										value={recordsPerPage.toString()}
										//@ts-ignore
										onChange={(e) => {
											handlePerPageChange(e);
										}}
									/>
								</div>
								<Pagination
									size="sm"
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

	const {
		data: { session },
	} = await supabase.auth.getSession();

	try {
		const currentPage = ctx.query.page
			? parseInt(ctx.query.page as string)
			: 1;

		let records_per_page = 25;
		const perPage = Array.isArray(ctx.query.per_page)
			? ctx.query.per_page[0]
			: ctx.query.per_page;
		if (perPage) {
			records_per_page = parseInt(perPage);
		}
		// const startIndex = (currentPage - 1) * records_per_page;

		const record_res: Supabase_Response<RecordsView[]> = await supabase
			.from("records_view")
			.select("*")
			.range(0, records_per_page - 1);
		//.range(startIndex, startIndex + records_per_page - 1);
		// .order("date", { ascending: false });

		const { data: record_data, error: record_error } = record_res;

		return {
			props: { session, record_data, records_per_page },
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
