import Layout from "@/components/Layout";
import {
	Category,
	Department,
	Deposit,
	Member,
	Record,
	Supabase_Response,
} from "@/types/models";
import addCommasToAmount from "@/utils/addCommasToAmount";
import formatDate from "@/utils/formatDate";
import { createSupabaseReqResClient } from "@/utils/supabase";
import {
	Anchor,
	Breadcrumbs,
	Button,
	Container,
	Flex,
	NumberInput,
	Select,
	SimpleGrid,
	Textarea,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { Session } from "@supabase/supabase-js";
import _ from "lodash";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { record, z } from "zod";

type mantineSelectData = {
	value: string;
	label: string;
};

type EditRecordProps = {
	record_data: Record[];
	dept_data: Department[];
	cat_data: Category[];
	member_data: Member[];
	deposit_data: Deposit[];
	session: Session;
};

export default function EditRecord({
	record_data,
	dept_data,
	cat_data,
	member_data,
	deposit_data,
	session,
}: EditRecordProps) {
	const [btnIsDisabled, setBtnIsDisabled] = useState<boolean>(false);
	const [recordData, setRecordData] = useState<Record>(record_data[0]);

	const [showMemberDropdown, setShowMemberDropdown] = useState<
		boolean | null
	>(() => {
		if (recordData.category_id === 1) {
			return true;
		} else {
			return false;
		}
	});
	const [showDeptDropdown, setShowDeptDropdown] = useState<boolean | null>(
		() => {
			if (recordData.category_id === 1) {
				return false;
			} else {
				return true;
			}
		}
	);

	const editRecordSchema = z.object({
		id: z.string().uuid(),
		member_id: z.string().uuid().nullable(),
		department_id: z.number().or(z.string()),
		category_id: z.number().or(z.string()),
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
		status: z.enum(["recorded", "deposited"]),
		created_at: z
			.date({
				required_error: "Please select a date and time",
				invalid_type_error: "That's not a date!",
			})
			.nullable()
			.or(z.string().nullable()),
	});

	const tesoreriaForm = useForm({
		validate: zodResolver(editRecordSchema),
		initialValues: {
			id: recordData.id,
			member_id: recordData.member_id,
			department_id: String(recordData.department_id),
			category_id: String(recordData.category_id),
			amount: parseFloat(
				addCommasToAmount((recordData.amount / 100).toFixed(2))
			),
			income_expense: recordData.income_expense,
			payment_type: recordData.payment_type,
			date: new Date(formatDate(recordData.date)),
			description_notes: recordData.description_notes,
			deposit_id: recordData.deposit_id,
			deposit_date: new Date(formatDate(recordData.deposit_date || "")),
			status: recordData.status,
			created_at: recordData.created_at,
		},
	});

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

	const submitEditRecord = async (values: any) => {
		setBtnIsDisabled(true);
		console.log(values);
		if (values.department_id == null && values.member_id == null) {
			console.error("department or member is required");
			setBtnIsDisabled(false);
			return false;
		}

		var newData = _.cloneDeep(values);
		newData.amount = parseInt(
			(parseFloat(newData.amount) * 100).toFixed(2)
		);

		// // newData.deposit_date = supabaseDate(newData.deposit_date);

		const editRecordResponse = await fetch("/api/record/", {
			method: "PUT",
			body: JSON.stringify(newData),
		});

		const { data, error } = await editRecordResponse.json();
		console.log(data);
		if (error) {
			console.error(error);
		}
		// // handle error, add logging

		setRecordData(data[0]);
		tesoreriaForm.setValues({ ...newData, amount: newData.amount / 100 });

		setBtnIsDisabled(false);
	};

	const items: any = [
		{ title: "Records", href: "/view/records" },
		{ title: "Edit Record", href: "##" },
	];

	const breadCrumbItems = items.map((item: any, index: number) =>
		index !== items.length - 1 ? (
			<Anchor href={item.href} key={index}>
				{item.title}
			</Anchor>
		) : (
			<span key={index}>{item.title}</span>
		)
	);

	const handleCatSearchChange = (target: string | null) => {
		if (target) {
			if (parseInt(target) === 1) {
				setShowMemberDropdown(true);
				setShowDeptDropdown(false);
			} else {
				setShowMemberDropdown(false);
				setShowDeptDropdown(true);
			}
			tesoreriaForm.setValues({ category_id: target });
		}
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
				<title>Ezer | Edit Record</title>
			</Head>
			<Layout session={session}>
				{/* {JSON.stringify(record_data)} */}
				<Container>
					<Breadcrumbs separator=">" mt="xs">
						{breadCrumbItems}
					</Breadcrumbs>
					<Flex className="mt-8" direction="column">
						<Title order={2}>Edit Record</Title>
					</Flex>

					<form
						className="flex flex-col gap-y-6 mt-3 mb-2"
						action=""
						id="form-add-record"
						onSubmit={tesoreriaForm.onSubmit((values) =>
							submitEditRecord(values)
						)}
					>
						<Select
							label="Category"
							placeholder="Pick Category"
							data={cat_names(cat_data)}
							size="lg"
							clearable={true}
							{...tesoreriaForm.getInputProps("category_id")}
							onChange={handleCatSearchChange}
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
							// defaultValue={0.0}
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

						<Select
							label="Status?"
							data={[
								{
									value: "recorded",
									label: "Recorded",
								},
								{
									value: "deposited",
									label: "Deposited",
								},
							]}
							size="lg"
							{...tesoreriaForm.getInputProps("status")}
						/>

						<Button
							variant="filled"
							size="lg"
							id="submit-btn"
							type="submit"
							loading={btnIsDisabled}
						>
							Submit
						</Button>
					</form>
				</Container>
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
		const [
			record_res,
			department_res,
			category_res,
			member_res,
			deposit_res,
		]: [
			Supabase_Response<Record[]>,
			Supabase_Response<Department[]>,
			Supabase_Response<Category[]>,
			Supabase_Response<Member[]>,
			Supabase_Response<Deposit[]>
		] = await Promise.all([
			supabase.from("records").select("*").eq("id", id),
			supabase.from("departments").select("*"),
			supabase.from("categories").select("*"),
			supabase
				.from("members")
				.select("*")
				.eq("is_active", "true")
				.order("full_name", { ascending: true }),
			supabase.from("deposits").select("*"),
		]);

		const { data: dept_data, error: dept_error } = department_res;
		const { data: cat_data, error: cat_error } = category_res;
		const { data: member_data, error: member_error } = member_res;
		const { data: deposit_data, error: deposit_error } = deposit_res;

		const { data: record_data, error: record_error } = record_res;

		return {
			props: {
				record_data,
				dept_data,
				cat_data,
				member_data,
				deposit_data,
				session,
			},
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
