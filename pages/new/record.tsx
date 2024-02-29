import _ from "lodash";
import Head from "next/head";
import React, { useState } from "react";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useForm } from "@mantine/form";
import {
	Button,
	NumberInput,
	Select,
	SimpleGrid,
	Textarea,
} from "@mantine/core";
import { createSupabaseReqResClient } from "@/utils/supabase";

import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";

import type { GetServerSidePropsContext } from "next/types";
import type {
	Category,
	Department,
	Deposit,
	Member,
	Supabase_Response,
} from "@/types/models";
import { DateInput } from "@mantine/dates";
import capitalize from "@/utils/capitalize";
import googleDate from "@/utils/googleDate";
import Layout from "@/components/Layout";

import { Session } from "@supabase/supabase-js";
import formatDate from "@/utils/formatDate";
import addCommasToAmount from "@/utils/addCommasToAmount";
import supabaseDate from "@/utils/supabaseDate";

type mantineSelectData = {
	value: string;
	label: string;
};

type NewRecordProps = {
	session: Session;
	dept_data: Department[];
	cat_data: Category[];
	member_data: Member[];
	deposit_data: Deposit[];
};

const GOOGLE_PROJECT_BASE_URL = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_BASE_URL;

const NewRecord = ({
	session,
	dept_data,
	cat_data,
	member_data,
	deposit_data,
}: NewRecordProps) => {
	const [btnIsDisabled, setBtnIsDisabled] = useState<boolean>(false);
	const [showMemberDropdown, setShowMemberDropdown] = useState<
		boolean | null
	>(false);
	const [showDeptDropdown, setShowDeptDropdown] = useState<boolean | null>(
		false
	);

	function cat_names(cat_data: Category[]) {
		if (!cat_data) {
			// Handle the case where cat_data is null or undefined
			return [];
		}

		const extractNames: mantineSelectData[] = cat_data.map(
			(category: Category) => {
				return {
					value: category.id.toString() as string,
					label: category.name as string,
				};
			}
		);
		return extractNames;
	}

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

	function dept_names(dept_data: Department[]) {
		if (!dept_data) {
			return [];
		}

		const extractNames: mantineSelectData[] = dept_data.map(
			(dept: Department) => {
				return {
					value: dept.id.toString() as string,
					label: dept.name as string,
				};
			}
		);
		return extractNames;
	}

	function deposits(deposit_data: Deposit[]) {
		if (!deposit_data) {
			// Handle the case where deposit_data is null or undefined
			return [];
		}

		const extractNames: mantineSelectData[] = deposit_data.map(
			(deposit: Deposit) => {
				return {
					value: deposit.id.toString() as string,
					label:
						((" $" +
							addCommasToAmount(
								(deposit.amount / 100).toFixed(2)
							)) as string) +
						" - " +
						formatDate(deposit.deposit_date),
				};
			}
		);
		return extractNames;
	}

	const newRecordSchema = z.object({
		member_id: z.string().uuid().nullable(),
		department_id: z.number().or(z.string()).nullable(),
		category_id: z.number().or(z.string().nullable()),
		amount: z.number().or(
			z.number().refine(
				(n) => {
					return n.toString().split(".")[1].length <= 2;
				},
				{ message: "Max precision is 2 decimal places" }
			)
		),
		income_expense: z.enum(["income", "expense"]),
		payment_type: z.enum(["cash", "check", "venmo", "debitCard"]),
		date: z.date({
			required_error: "Please select a date and time",
			invalid_type_error: "That's not a date!",
		}),
		description_notes: z.string().optional(),
		deposit_id: z.string().uuid().nullable(),
		deposit_date: z
			.date({
				required_error: "Please select a date and time",
				invalid_type_error: "That's not a date!",
			})
			.nullable()
			.or(z.string().nullable()),
		// .nullable()
		// status: z.enum(["deposited", "recorded"]),
	});

	const tesoreriaForm = useForm({
		validate: zodResolver(newRecordSchema),
		initialValues: {
			member_id: null,
			department_id: null,
			category_id: "",
			amount: 0,
			income_expense: "income",
			payment_type: "cash",
			date: new Date(),
			description_notes: "",
			deposit_id: null,
			deposit_date: null,
			// status: "recorded",
		},
	});

	const submitNewRecord = async (values: any) => {
		setBtnIsDisabled(true);
		if (values.department_id == null && values.member_id == null) {
			console.error("department or member is required");
			return false;
		}

		var newData = _.cloneDeep(values);
		console.log(values);

		newData.date = supabaseDate(newData.date);
		newData.category_id = parseInt(newData.category_id);
		newData.department_id = parseInt(newData.department_id);
		newData.status = "recorded";
		newData.amount = parseInt(
			(parseFloat(newData.amount) * 100).toFixed(2)
		);

		const newRecordResponse = await fetch("/api/record", {
			method: "POST",
			body: JSON.stringify(newData),
		});

		const { data, error } = await newRecordResponse.json();

		console.log(data);
		if (error) {
			console.error(error);
		}
		if (data !== null) {
			await add2GoogleSheet(data[0]);

			const previousDate = formatDate(data[0].date);
			const isVenmo =
				data[0].payment_type.toLowerCase() == "venmo"
					? "venmo"
					: "cash";
			const depositInfo = {
				id: data[0].deposit_id,
				date: formatDate(data[0].deposit_date),
			};

			tesoreriaForm.reset();
			tesoreriaForm.setValues({
				//@ts-ignore
				category_id: null,
				date: new Date(previousDate),
				payment_type: isVenmo,
				deposit_id: depositInfo.id,
				//@ts-ignore
				deposit_date: new Date(formatDate(depositInfo.date)) as string,
			});
			setShowMemberDropdown(false);
			setShowDeptDropdown(false);
			setBtnIsDisabled(false);
		}
	};

	const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
		const input = event.target as HTMLElement;
		// console.log(input.innerText);
		// console.log(tesoreriaForm);

		switch (input.innerText) {
			case "Diezmo":
				tesoreriaForm.setValues({ category_id: "1" });
				setShowMemberDropdown(true);
				setShowDeptDropdown(false);
				break;
			case "Ofrenda":
				tesoreriaForm.setValues({ category_id: "2" });
				setShowMemberDropdown(false);
				setShowDeptDropdown(true);
				break;
			case "Other":
				//@ts-ignore
				tesoreriaForm.setValues({ category_id: null });
				setShowMemberDropdown(false);
				setShowDeptDropdown(true);
				break;
			default:
				tesoreriaForm.setValues({ category_id: "" });
				setShowMemberDropdown(false);
				setShowDeptDropdown(true);
		}
	};

	const add2GoogleSheet = async (data: any) => {
		const member = data.member_name === null ? "" : data.member_name;
		const dept = data.department_name === null ? "" : data.department_name;
		const res = await fetch(`${GOOGLE_PROJECT_BASE_URL}?
						&categorias=${data.category_name}
						&nombre=${member}
						&departamento=${dept}
						&cantidad=${data.amount / 100}
						&entrada_o_salida=${data.entrada_salida}
						&cash_o_check=${data.payment_type}
						&descripcion=${encodeURIComponent(data.description_notes)}
						&date=${googleDate(data.date)}
						&status=${capitalize(data.status)}`);

		const { resdata, error } = await res.json();
		console.log(resdata);
		console.error(error);
	};

	const handleDepositDate = (id: any) => {
		console.log(id);

		deposit_data.forEach((deposit) => {
			if (id === deposit.id) {
				tesoreriaForm.setValues({
					//@ts-ignore
					deposit_date: new Date(
						formatDate(deposit.deposit_date)
					) as string,
					//@ts-ignore
					deposit_id: deposit.id,
				});
			}
		});
	};

	return (
		<>
			<Head>
				<title>Ezer | New Record</title>
			</Head>
			<Layout session={session}>
				<div className="h-screen max-w-screen-lg mt-6 mb-12 mx-4">
					<SimpleGrid cols={{ sm: 3 }}>
						<Button
							variant="filled"
							size="xl"
							onClick={handleCategoryClick}
							className="p-8"
						>
							Diezmo
						</Button>

						<Button
							variant="light"
							size="xl"
							onClick={handleCategoryClick}
						>
							Ofrenda
						</Button>

						<Button
							variant="outline"
							size="xl"
							onClick={handleCategoryClick}
						>
							Other
						</Button>
					</SimpleGrid>

					<form
						className="flex flex-col gap-y-6 mt-3"
						action=""
						id="form-add-record"
						onSubmit={tesoreriaForm.onSubmit((values) =>
							submitNewRecord(values)
						)}
					>
						<Select
							label="Category"
							placeholder="Pick Category"
							data={cat_names(cat_data)}
							size="lg"
							clearable={true}
							// searchable
							// onSearchChange={handleCatSearchChange}
							// searchValue={cat}
							{...tesoreriaForm.getInputProps("category_id")}
						/>

						<Select
							className={showMemberDropdown ? "block" : "hidden"}
							label="Member Name"
							placeholder="Choose Member"
							data={member_names(member_data)}
							searchable
							size="lg"
							{...tesoreriaForm.getInputProps("member_id")}
						/>

						<Select
							className={showDeptDropdown ? "block" : "hidden"}
							label="Departamentos y Sociedades"
							placeholder="Pick Departamentos o Sociedad"
							data={dept_names(dept_data)}
							searchable
							size="lg"
							{...tesoreriaForm.getInputProps("department_id")}
						/>

						<NumberInput
							label="Amount"
							placeholder="Dollars"
							prefix="$"
							min={0}
							defaultValue={0.0}
							// mb="md"
							size="lg"
							{...tesoreriaForm.getInputProps("amount")}
						/>

						<Select
							label="Entrada o Salida?"
							placeholder="Entrada o Salida"
							data={[
								{
									value: "income",
									label: "Entrada",
								},
								{
									value: "expense",
									label: "Salida",
								},
							]}
							value="Entrada"
							size="lg"
							{...tesoreriaForm.getInputProps("income_expense")}
						/>

						<Select
							label="Cash o Check?"
							placeholder="Cash o Check"
							data={[
								{
									value: "cash",
									label: "Cash",
								},
								{
									value: "check",
									label: "Check",
								},
								{
									value: "venmo",
									label: "Venmo",
								},
								{
									value: "debitCard",
									label: "Debit Card",
								},
							]}
							value="Entrada"
							size="lg"
							{...tesoreriaForm.getInputProps("payment_type")}
						/>

						<Textarea
							label="Description or Notes"
							placeholder=""
							size="lg"
							rows={2}
							{...tesoreriaForm.getInputProps(
								"description_notes"
							)}
						/>

						<DateInput
							valueFormat="MM/DD/YYYY"
							// defaultvalue={new Date()}
							label="Date"
							placeholder="Date"
							size="lg"
							firstDayOfWeek={0}
							{...tesoreriaForm.getInputProps("date")}
						/>

						<SimpleGrid cols={2}>
							<Select
								label="Deposit ID"
								placeholder="Pick Deposit"
								data={deposits(deposit_data)}
								searchable
								size="lg"
								{...tesoreriaForm.getInputProps("deposit_id")}
								onChange={handleDepositDate}
							/>
							<DateInput
								disabled={true}
								valueFormat="MM/DD/YYYY"
								label="Deposit Date"
								placeholder="Deposit Date"
								size="lg"
								{...tesoreriaForm.getInputProps("deposit_date")}
							/>
						</SimpleGrid>
						<Button
							variant="filled"
							size="lg"
							id="submit-btn"
							type="submit"
							loading={btnIsDisabled}
							// disabled={btnIsDisabled}
						>
							Submit
						</Button>
					</form>
				</div>
			</Layout>
		</>
	);
};
export default NewRecord;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createSupabaseReqResClient(ctx);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	try {
		const [department_res, category_res, member_res, deposit_res]: [
			Supabase_Response<Department>,
			Supabase_Response<Category>,
			Supabase_Response<Member>,
			Supabase_Response<Deposit>
		] = await Promise.all([
			supabase.from("departments").select("*"),
			supabase.from("categories").select("*"),
			supabase
				.from("members")
				.select("*")
				.eq("is_active", "true")
				.order("full_name", { ascending: true }),
			supabase.from("deposits").select("*").eq("is_closed", false),
		]);

		const { data: dept_data, error: dept_error } = department_res;
		const { data: cat_data, error: cat_error } = category_res;
		const { data: member_data, error: member_error } = member_res;
		const { data: deposit_data, error: deposit_error } = deposit_res;
		return {
			props: { session, dept_data, cat_data, member_data, deposit_data },
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
