import Layout from "@/components/Layout";
import type {
	Department,
	RecordsView,
	Supabase_Response,
} from "@/types/models";
import addCommasToAmount from "@/utils/addCommasToAmount";
import capitalize from "@/utils/capitalize";
import formatDate from "@/utils/formatDate";
import {
	createSupabaseFrontendClient,
	createSupabaseReqResClient,
} from "@/utils/supabase";
import { Text, Button, Container, Select, Table, Tabs } from "@mantine/core";
import { Session } from "@supabase/supabase-js";
import { IconCoinOff, IconPremiumRights } from "@tabler/icons-react";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";
import React, { useEffect, useState } from "react";

type mantineSelectData = {
	value: string;
	label: string;
};
type AppProps = {
	session: Session | null;
	dept_data: Department[];
};

export default function Department({ session, dept_data }: AppProps) {
	const [selectDept, setSelectedDepartment] = useState<number>(0);
	const [unfilteredRecords, setUnfilteredRecords] = useState<
		RecordsView[] | null
	>(null);
	const [records, setRecords] = useState<RecordsView[] | null>(null);
	const [totalIncome, setTotalIncome] = useState<number>(0);
	const [totalOfrenda, setTotalOfrenda] = useState<number>(0);
	const [totalExpense, setTotalExpense] = useState<number>(0);
	const [hideOfrendas, setHideOfrendas] = useState<boolean>(false);

	const supabase = createSupabaseFrontendClient();

	function dept_names(dept_data: Department[]) {
		if (!dept_data) {
			return [];
		}

		const extractNames: mantineSelectData[] = dept_data.map(
			(dept: Department) => {
				return {
					value: dept.id.toString(),
					label: dept.name as string,
				};
			}
		);
		return extractNames;
	}

	useEffect(() => {
		getDeptRecords();
		setHideOfrendas(false);
	}, [selectDept]);

	const getDeptRecords = async () => {
		const { data, error } = await supabase.rpc("get_dept_records", {
			dept_id: selectDept,
		});
		if (data) {
			setRecords(data);
			setUnfilteredRecords(data);
			let incomeTotal = 0;
			let ofrendaTotal = 0;
			let expenseTotal = 0;
			data.forEach((record) => {
				if (record.amount && record.income_expense === "income") {
					if (record.category_id === 2) {
						// ofrenda
						ofrendaTotal += record.amount;
					} else {
						incomeTotal += record.amount;
					}
				}
				if (record.amount && record.income_expense === "expense") {
					expenseTotal += record.amount;
				}
			});
			setTotalIncome(incomeTotal / 100);
			setTotalOfrenda(ofrendaTotal / 100);
			setTotalExpense(expenseTotal / 100);
		}
	};

	const handleDeptChange = (value: string | null) => {
		if (value) {
			setSelectedDepartment(parseInt(value));
		}
	};

	const handleHideOfrendas = () => {
		if (!hideOfrendas) {
			const filteredRecords = records?.filter(
				(record) => record.category_id !== 2
			);
			if (filteredRecords) {
				setRecords(filteredRecords);
			}
		} else {
			const filteredRecords = unfilteredRecords?.filter(
				(record) => record
			);
			if (filteredRecords) {
				setRecords(filteredRecords);
			}
		}
		setHideOfrendas(!hideOfrendas);
	};

	const incomeRows = records
		? records.map((record) => {
				if (
					record.amount &&
					record.id &&
					record.income_expense === "income"
				) {
					return (
						<Table.Tr
							key={record.id}
							className={
								record.category_id === 2 ? "text-amber-700" : ""
							}
						>
							<Table.Td>
								{capitalize(record.category_name || "")}
							</Table.Td>
							<Table.Td>{`$${addCommasToAmount(
								(record.amount / 100).toFixed(2)
							)}`}</Table.Td>

							<Table.Td>{record.description_notes}</Table.Td>
							<Table.Td>{formatDate(record.date || "")}</Table.Td>
							<Table.Td>
								{capitalize(record.payment_type || "")}
							</Table.Td>
						</Table.Tr>
					);
				}
		  })
		: [];

	const expenseRows = records
		? records.map((record) => {
				if (
					record.amount &&
					record.id &&
					record.income_expense === "expense"
				) {
					return (
						<Table.Tr key={record.id} className="text-red-500">
							<Table.Td>
								{capitalize(record.category_name || "")}
							</Table.Td>
							<Table.Td>{`$${addCommasToAmount(
								(record.amount / 100).toFixed(2)
							)}`}</Table.Td>

							<Table.Td>{record.description_notes}</Table.Td>
							<Table.Td>{formatDate(record.date || "")}</Table.Td>
							<Table.Td>
								{capitalize(record.payment_type || "")}
							</Table.Td>
						</Table.Tr>
					);
				}
		  })
		: [];

	const iconStyle = { width: "1rem", height: "1rem" };

	return (
		<>
			<Head>
				<title>Ezer | Department and Sociedad Report</title>
			</Head>
			<Layout session={session}>
				<Container>
					<Select
						className="my-4"
						size="lg"
						label="Select Department"
						data={dept_names(dept_data)}
						onChange={handleDeptChange}
						placeholder="Search or scroll down the list to select a member"
						searchable
					></Select>

					{hideOfrendas && records && (
						<Button
							variant="outline"
							color="orange"
							onClick={handleHideOfrendas}
						>
							Show Ofrendas
						</Button>
					)}
					{!hideOfrendas && records && (
						<Button variant="outline" onClick={handleHideOfrendas}>
							Hide Ofrendas
						</Button>
					)}

					{records && records.length > 0 && (
						<>
							<Tabs
								defaultValue="income"
								className="mt-4 text-lg"
							>
								<Tabs.List grow>
									<Tabs.Tab
										color="green"
										value="income"
										leftSection={
											<IconPremiumRights
												style={iconStyle}
											/>
										}
									>
										Entradas
									</Tabs.Tab>
									<Tabs.Tab
										color="red"
										value="expenses"
										leftSection={
											<IconCoinOff style={iconStyle} />
										}
									>
										Salidas
									</Tabs.Tab>
								</Tabs.List>
								<Tabs.Panel value="income">
									<Table.ScrollContainer
										minWidth={600}
										type="native"
									>
										<Table
											striped
											withTableBorder
											className="mt-4"
										>
											<Table.Thead>
												<Table.Tr>
													<Table.Th>
														Category
													</Table.Th>
													<Table.Th>Amount</Table.Th>
													<Table.Th>Notes</Table.Th>
													<Table.Th>Date</Table.Th>
													<Table.Th>
														Payment Type
													</Table.Th>
												</Table.Tr>
											</Table.Thead>
											<Table.Tbody>
												{incomeRows}
											</Table.Tbody>
										</Table>
									</Table.ScrollContainer>
								</Tabs.Panel>

								<Tabs.Panel value="expenses">
									{records !== null && records.length > 0 && (
										<>
											<Table.ScrollContainer
												minWidth={600}
											>
												<Table
													striped
													withTableBorder
													className="mt-4"
												>
													<Table.Thead>
														<Table.Tr>
															<Table.Th>
																Category
															</Table.Th>
															<Table.Th>
																Amount
															</Table.Th>
															<Table.Th>
																Notes
															</Table.Th>
															<Table.Th>
																Date
															</Table.Th>
															<Table.Th>
																Payment Type
															</Table.Th>
														</Table.Tr>
													</Table.Thead>
													<Table.Tbody>
														{expenseRows}
													</Table.Tbody>
												</Table>
											</Table.ScrollContainer>
										</>
									)}
									{records !== null &&
										records.length === 0 && (
											<p className="mt-4">
												No records found for the
												selected department.
											</p>
										)}
								</Tabs.Panel>
							</Tabs>
							<div className="bg-gray-200 p-3">
								<Text>
									Entradas Total: $
									{addCommasToAmount(totalIncome.toFixed(2))}
								</Text>
								<Text>
									Salidas Total:
									<span className="!text-red-500">
										{` $(${addCommasToAmount(
											totalExpense.toFixed(2)
										)})`}
									</span>
								</Text>
								<Text>
									Ofrenda Total: $
									{addCommasToAmount(totalOfrenda.toFixed(2))}
								</Text>
							</div>
						</>
					)}
					{records !== null && records.length === 0 && (
						<p className="mt-4">
							No records found for the selected department.
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
		const dept_res: Supabase_Response<Department> = await supabase
			.from("departments")
			.select("*")
			.eq("is_active", "true")
			.order("name", { ascending: true });

		const { data: dept_data, error: dept_error } = dept_res;

		return {
			props: { session, dept_data },
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
