import { z } from "zod";
import Head from "next/head";
import React, { useState } from "react";
import { zodResolver } from "mantine-form-zod-resolver";

import { useForm } from "@mantine/form";
import {
	Button,
	Flex,
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

import { DateInput } from "@mantine/dates";
import capitalize from "@/utils/capitalize";
import addCommasToAmount from "@/utils/addCommasToAmount";
import googleDate from "@/utils/googleDate";
import Layout from "@/components/Layout";

import { Session } from "@supabase/supabase-js";
import formatDate from "@/utils/formatDate";
import { useRouter } from "next/router";
import supabaseDate from "@/utils/supabaseDate";

type NewDepositProps = {
	session: Session;
	deposit_data: Deposit[];
};

export default function NewDeposit({ session, deposit_data }: NewDepositProps) {
	const [btnIsDisabled, setBtnIsDisabled] = useState<boolean>(false);
	const router = useRouter();

	const rows = deposit_data.map((deposit) => (
		<Table.Tr key={deposit.id}>
			<Table.Td>{capitalize(deposit.deposit_type)}</Table.Td>
			<Table.Td>{formatDate(deposit.deposit_date)}</Table.Td>
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

		values.amount = parseInt((parseFloat(values.amount) * 100).toFixed(2));
		values.deposit_date = supabaseDate(values.deposit_date);
		const newDepositResponse = await fetch("/api/deposit", {
			method: "POST",
			body: JSON.stringify(values),
		});

		const { data, error } = await newDepositResponse.json();

		if (error) {
			console.error(error);
		}
		// handle error, add logging

		//if deposit is not closed
		// update deposit_data array to show new deposit in list

		router.reload();
		setBtnIsDisabled(false);
	};

	return (
		<>
			<Head>
				<title>Ezer | New Deposit</title>
			</Head>
			<Layout session={session}>
				<div className="h-screen max-w-screen-lg mt-6 mb-12 mx-4">
					{deposit_data.length > 0 && (
						<>
							<Title order={2}>Open Deposits</Title>
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
							<br />
							<Button
								variant="outline"
								color="yellow"
								onClick={() => {}}
							>
								View Closed Deposits
							</Button>
						</>
					)}

					<Flex className="mt-8" direction="column">
						<Title order={2}>Create New Deposit</Title>
						<form
							className="flex flex-col gap-y-6 mt-3"
							id="form-add-record"
							onSubmit={depositForm.onSubmit((values) =>
								submitNewDeposit(values)
							)}
						>
							<DateInput
								valueFormat="MM/DD/YYYY"
								label="Deposit Date"
								placeholder="Date"
								size="lg"
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
								value="Entrada"
								size="lg"
								{...depositForm.getInputProps("deposit_type")}
							/>

							<NumberInput
								label="Amount"
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
								Submit
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
		const [deposit_res]: [Supabase_Response<Deposit>] = await Promise.all([
			supabase.from("deposits").select("*").eq("is_closed", false),
		]);

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
