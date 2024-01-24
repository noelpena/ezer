import _ from "lodash";
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
	Member,
	Supabase_Response,
} from "@/types/models";
import { DateInput } from "@mantine/dates";
import capitalize from "@/utils/capitalize";
import googleDate from "@/utils/googleDate";

type mantineSelectData = {
	value: string;
	label: string;
};

type NewRecordProps = {
	dept_data: Department[];
	cat_data: Category[];
	member_data: Member[];
};

const GOOGLE_PROJECT_BASE_URL = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_BASE_URL;
const NewRecord = ({ dept_data, cat_data, member_data }: NewRecordProps) => {
	const [cat, setCat] = useState<string>("");

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

	const newRecordSchema = z.object({
		member_id: z.string().uuid().nullable(),
		department_id: z.number().or(z.string()).nullable(),
		category_id: z.number().or(z.string()),
		amount: z.number().refine(
			(n) => {
				return n.toString().split(".")[1].length <= 2;
			},
			{ message: "Max precision is 2 decimal places" }
		),
		income_expense: z.enum(["income", "expense"]),
		payment_type: z.enum(["cash", "check", "venmo", "debitCard"]),
		date: z.date({
			required_error: "Please select a date and time",
			invalid_type_error: "That's not a date!",
		}),
		description_notes: z.string().optional(),
		// status: z.enum(["deposited", "recorded"]),
		// deposit_id: z.string().uuid(),
	});

	const tesoreriaForm = useForm({
		validate: zodResolver(newRecordSchema),
		initialValues: {
			member_id: null,
			department_id: null,
			category_id: cat,
			amount: 0,
			income_expense: "income",
			payment_type: "cash",
			date: new Date(),
			description_notes: "",
			// status: "recorded",
			// deposit_id: null,
		},
	});

	const submitNewRecord = async (values: any) => {
		var newData = _.cloneDeep(values);
		console.log(values);

		newData.category_id = parseInt(newData.category_id);
		newData.department_id = parseInt(newData.department_id);
		newData.status = "recorded";
		newData.deposit_id = null;
		newData.amount = parseInt(
			(parseFloat(newData.amount) * 100).toFixed(2)
		);

		const newRecordResponse = await fetch("/api/record", {
			method: "POST",
			body: JSON.stringify(newData),
		});

		const { data, error } = await newRecordResponse.json();

		console.log(data);
		console.error(error);
		if (data !== null) {
			await add2GoogleSheet(data[0]);
		}

		tesoreriaForm.reset();
		setCat("");
	};

	const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
		const input = event.target as HTMLElement;
		setCat(input.innerText);
		// setCat("1");
	};

	const handleCatSearchChange = (event: React.ChangeEvent) => {
		console.dir(event);
		const selectedCat = event.toString();
		if (selectedCat === cat) {
			return false;
		}
		setCat(selectedCat);
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
						&descripcion=${data.description_notes}
						&date=${googleDate(data.date)}
						&status=${capitalize(data.status)}`);

		const { resdata, error } = await res.json();
		console.log(resdata);
		console.error(error);
	};

	return (
		<div className="h-screen w-full m-auto mt-12">
			{/* <SimpleGrid cols={3}>
				<Button
					variant="filled"
					size="xl"
					onClick={handleCategoryClick}
					className="p-8"
				>
					Diezmo
				</Button>

				<Button variant="light" size="xl" onClick={handleCategoryClick}>
					Ofrenda
				</Button>

				<Button
					variant="outline"
					size="xl"
					onClick={handleCategoryClick}
				>
					Other
				</Button>
			</SimpleGrid> */}

			<form
				className="flex flex-col gap-y-6"
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
					searchable
					// onSearchChange={handleCatSearchChange}
					// searchValue={cat}
					size="xl"
					{...tesoreriaForm.getInputProps("category_id")}
				/>

				<Select
					label="Member Name"
					placeholder="Choose Member"
					data={member_names(member_data)}
					searchable
					size="xl"
					{...tesoreriaForm.getInputProps("member_id")}
				/>

				<Select
					label="Departamentos y Sociedades"
					placeholder="Pick Departamentos o Sociedad"
					data={dept_names(dept_data)}
					searchable
					size="xl"
					{...tesoreriaForm.getInputProps("department_id")}
				/>

				<NumberInput
					label="Amount"
					placeholder="Dollars"
					prefix="$"
					min={0}
					defaultValue={0.0}
					mb="md"
					size="xl"
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
					size="xl"
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
					size="xl"
					{...tesoreriaForm.getInputProps("payment_type")}
				/>

				<Textarea
					label="Description or Notes"
					placeholder=""
					size="xl"
					{...tesoreriaForm.getInputProps("description_notes")}
				/>

				<DateInput
					valueFormat="MM/DD/YYYY"
					// defaultvalue={new Date()}
					label="Date"
					placeholder="Date"
					size="xl"
					{...tesoreriaForm.getInputProps("date")}
				/>

				<Button
					// onClick={submitNewRecord}
					color="green"
					variant="filled"
					size="xl"
					id="submit-btn"
					type="submit"
				>
					Submit
				</Button>
			</form>
		</div>
	);
};
export default NewRecord;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createSupabaseReqResClient(ctx);

	try {
		const [department_res, category_res, member_res]: [
			Supabase_Response<Department>,
			Supabase_Response<Category>,
			Supabase_Response<Member>
		] = await Promise.all([
			supabase.from("departments").select("*"),
			supabase.from("categories").select("*"),
			supabase.from("members").select("*").eq("is_active", "true"),
		]);

		const { data: dept_data, error: dept_error } = department_res;
		const { data: cat_data, error: cat_error } = category_res;
		const { data: member_data, error: member_error } = member_res;

		return {
			props: { dept_data, cat_data, member_data },
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
