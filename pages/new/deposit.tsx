import { z } from "zod";
import Head from "next/head";
import React, { useState } from "react";
import { zodResolver } from "mantine-form-zod-resolver";

import { useForm } from "@mantine/form";
import {
	Anchor,
	Breadcrumbs,
	Button,
	Flex,
	Group,
	NumberInput,
	Select,
	SimpleGrid,
	Table,
	Textarea,
	Title,
} from "@mantine/core";
import { createSupabaseReqResClient } from "@/utils/supabase";

import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";

import type { GetServerSidePropsContext } from "next/types";
import type { Deposit, Supabase_Response } from "@/types/models";

import { DatePickerInput } from "@mantine/dates";
import capitalize from "@/utils/capitalize";
import addCommasToAmount from "@/utils/addCommasToAmount";
import Layout from "@/components/Layout";

import { Session } from "@supabase/supabase-js";
import formatDate from "@/utils/formatDate";
import { useRouter } from "next/router";
import supabaseDate from "@/utils/supabaseDate";
import _ from "lodash";
import { showToast, updateToast } from "@/utils/notification";
import { IconArrowLeft } from "@tabler/icons-react";

type NewDepositProps = {
	session: Session;
	deposit_data: Deposit[];
};

export default function NewDeposit({ session, deposit_data }: NewDepositProps) {
	const [btnIsDisabled, setBtnIsDisabled] = useState<boolean>(false);
	const [depositData, setDepositData] = useState<Deposit[]>(deposit_data);
	const router = useRouter();

	const rows = depositData.map((deposit) => (
		<Table.Tr key={deposit.id}>
			<Table.Td>{capitalize(deposit.deposit_type)}</Table.Td>
			<Table.Td>
				{formatDate(deposit.deposit_date.replace("-", "/"))}
			</Table.Td>
			<Table.Td>
				${addCommasToAmount((deposit.amount / 100).toFixed(2))}
			</Table.Td>
			<Table.Td>{deposit.notes}</Table.Td>
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

	const newDepositSchema = z.object({
		deposit_date: z.date({
			required_error: "Please select a date and time",
			invalid_type_error: "That's not a date!",
		}),
		amount: z.number().or(
			z.number().refine(
				(n) => {
					return n.toString().split(".")[1].length <= 2;
				},
				{ message: "Max precision is 2 decimal places" }
			)
		),
		notes: z.string().optional(),
		deposit_type: z.enum(["bank", "venmo"]),
		is_closed: z.boolean().or(z.enum(["true", "false"])),
	});

	const depositForm = useForm({
		validate: zodResolver(newDepositSchema),
		initialValues: {
			deposit_date: new Date(),
			amount: 0,
			notes: "",
			deposit_type: "bank",
			is_closed: "false",
		},
	});

	const submitNewDeposit = async (values: any) => {
		setBtnIsDisabled(true);
		showToast(
			"new-deposit",
			"Loading...",
			"Saving new deposit record to the database.",
			"blue",
			true
		);
		var newData = _.cloneDeep(values);
		newData.amount = parseInt(
			(parseFloat(newData.amount) * 100).toFixed(2)
		);
		newData.deposit_date = supabaseDate(newData.deposit_date);

		const newDepositResponse = await fetch("/api/deposit", {
			method: "POST",
			body: JSON.stringify(newData),
		});

		const { data, error } = await newDepositResponse.json();

		if (error) {
			console.error(error);
			updateToast(
				"new-deposit",
				"Failed.",
				"Something went wrong when adding new deposit to the database. " +
					error,
				"red"
			);
		} else {
			// handle error, add logging

			//if deposit is not closed
			if (!data[0].is_closed as boolean) {
				setDepositData([...depositData, data[0]]);
			}
			depositForm.reset();
			updateToast(
				"new-deposit",
				"Success!",
				"New deposit added to the database.",
				"green"
			);
		}

		setBtnIsDisabled(false);
	};

	const items: any = [
		{ title: "Deposits", href: "/view/deposits" },
		{ title: "New Deposit", href: "##" },
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

	return (
		<>
			<Head>
				<title>Ezer | New Deposit</title>
			</Head>
			<Layout session={session}>
				<div className="h-screen max-w-screen-lg mt-6 mb-12 mx-4">
					<Breadcrumbs separator=">" mt="xs" mb="xs">
						{breadCrumbItems}
					</Breadcrumbs>
					{depositData.length > 0 && (
						<>
							<Title order={2}>Open Deposits</Title>
							<Table.ScrollContainer minWidth={500}>
								<Table striped withTableBorder>
									<Table.Thead>
										<Table.Tr>
											<Table.Th>Deposit Type</Table.Th>
											<Table.Th>Date</Table.Th>
											<Table.Th>Amount</Table.Th>
											<Table.Th>Notes</Table.Th>
											<Table.Th>Actions</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>{rows}</Table.Tbody>
								</Table>
							</Table.ScrollContainer>
							<br />
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
						</>
					)}

					<Flex className="mt-8" direction="column">
						<SimpleGrid cols={{ base: 1, sm: 2 }}>
							<Title order={2}>Create New Deposit</Title>
							<Group
								justify="flex-end"
								className="!justify-start md:!justify-end"
							>
								<Button
									size="xs"
									color="gray"
									leftSection={<IconArrowLeft size={18} />}
									onClick={() => router.back()}
								>
									Go Back
								</Button>
							</Group>
						</SimpleGrid>

						<form
							className="flex flex-col gap-y-6 mt-3"
							id="form-add-record"
							onSubmit={depositForm.onSubmit((values) =>
								submitNewDeposit(values)
							)}
						>
							<DatePickerInput
								valueFormat="MM/DD/YYYY"
								label="Deposit Date"
								placeholder="Date"
								size="lg"
								firstDayOfWeek={0}
								{...depositForm.getInputProps("deposit_date")}
							/>
							<Select
								label="Deposit Type"
								placeholder=""
								data={[
									{
										value: "bank",
										label: "Bank",
									},
									{
										value: "venmo",
										label: "Venmo",
									},
								]}
								value="bank"
								size="lg"
								{...depositForm.getInputProps("deposit_type")}
							/>

							<NumberInput
								label="Deposit Amount"
								placeholder="Dollars"
								prefix="$"
								min={0}
								defaultValue={0.0}
								thousandSeparator=","
								size="lg"
								{...depositForm.getInputProps("amount")}
							/>

							<Select
								label="Is Deposit Closed?"
								placeholder=""
								data={[
									{
										value: "true",
										label: "Yes",
									},
									{
										value: "false",
										label: "No",
									},
								]}
								size="lg"
								{...depositForm.getInputProps("is_closed")}
							/>

							<Textarea
								label="Notes"
								placeholder=""
								size="lg"
								rows={2}
								{...depositForm.getInputProps("notes")}
							/>

							<Button
								variant="filled"
								size="lg"
								id="submit-btn"
								type="submit"
								loading={btnIsDisabled}
							>
								Create New Deposit
							</Button>
						</form>
					</Flex>
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
		const deposit_res: Supabase_Response<Deposit> = await supabase
			.from("deposits")
			.select("*")
			.eq("is_closed", false);

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
