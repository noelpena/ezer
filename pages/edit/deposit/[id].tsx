import Layout from "@/components/Layout";
import { Deposit, Supabase_Response } from "@/types/models";
import formatDate from "@/utils/formatDate";
import { showToast, updateToast } from "@/utils/notification";
import { createSupabaseReqResClient } from "@/utils/supabase";
import {
	Text,
	Anchor,
	Breadcrumbs,
	Button,
	Container,
	Flex,
	Group,
	Modal,
	NumberInput,
	Select,
	SimpleGrid,
	Textarea,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { PostgrestSingleResponse, Session } from "@supabase/supabase-js";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import _ from "lodash";
import Head from "next/head";
import router from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { z } from "zod";

import { useDisclosure } from "@mantine/hooks";

type EditDepositProps = {
	session: Session;
	deposit_data: Deposit[];
};

export default function EditDeposit({
	session,
	deposit_data,
}: EditDepositProps) {
	const [btnIsDisabled, setBtnIsDisabled] = useState<boolean>(false);
	const [depositData, setDepositData] = useState<Deposit>(deposit_data[0]);

	const [opened, { open, close }] = useDisclosure(false);

	const editDepositSchema = z.object({
		id: z.string().uuid(),
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
		validate: zodResolver(editDepositSchema),
		initialValues: {
			id: depositData.id,
			deposit_date: new Date(
				formatDate(depositData.deposit_date.replace("-", "/"))
			),
			amount: depositData.amount / 100,
			notes: depositData.notes,
			deposit_type: depositData.deposit_type,
			is_closed: depositData.is_closed.toString(),
		},
	});
	const submitEditDeposit = async (values: any) => {
		setBtnIsDisabled(true);
		showToast(
			"edit-deposit",
			"Loading...",
			"Editing deposit.",
			"blue",
			true
		);
		var newData = _.cloneDeep(values);
		newData.amount = parseInt(
			(parseFloat(newData.amount) * 100).toFixed(2)
		);
		// console.log(newData);
		// newData.deposit_date = supabaseDate(newData.deposit_date);

		const newDepositResponse = await fetch("/api/deposit/", {
			method: "PUT",
			body: JSON.stringify(newData),
		});

		const { data, error } = await newDepositResponse.json();
		// console.log(data);
		if (error) {
			console.error(error);
			updateToast(
				"edit-deposit",
				"Failed.",
				"Deposit was not updated. " + error,
				"red"
			);
		} else {
			updateToast(
				"edit-deposit",
				"Success!",
				"Deposit Updated.",
				"green"
			);
			depositForm.setValues({ ...newData, amount: newData.amount / 100 });
		}
		// // handle error, add logging

		// setDepositData(data[0]);

		setBtnIsDisabled(false);
	};

	const deleteDeposit = async () => {
		showToast(
			"delete-deposit",
			"Loading...",
			"Deleting deposit.",
			"blue",
			true
		);
		const deleteDepositResponse = await fetch("/api/deposit/", {
			method: "DELETE",
			body: JSON.stringify({ id: depositData.id }),
		});
		console.log(deleteDepositResponse);
		if (deleteDepositResponse.status === 204) {
			updateToast(
				"delete-deposit",
				"Success!",
				"Deposit was deleted.",
				"green"
			);
			router.push("/view/deposits");
		} else {
			updateToast(
				"delete-deposit",
				"Failed.",
				"Deposit was not deleted. " + deleteDepositResponse.statusText,
				"red"
			);
		}
	};

	const items: any = [
		{ title: "Deposits", href: "/view/deposits" },
		{ title: "Edit Deposit", href: "##" },
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
				<title>Ezer | Edit Deposit</title>
			</Head>
			<Layout session={session}>
				{/* {JSON.stringify(deposit_data)} */}
				<Container>
					<Breadcrumbs separator=">" mt="xs">
						{breadCrumbItems}
					</Breadcrumbs>
					<Flex className="mt-8" direction="column">
						{/* <Title order={2}>Edit Deposit</Title> */}

						<SimpleGrid className="mb-4" cols={{ base: 1, xs: 2 }}>
							<Title order={2}>Edit Deposit</Title>

							<Group justify="flex-end">
								<Button
									size="xs"
									color="gray"
									leftSection={<IconArrowLeft size={18} />}
									onClick={() => router.back()}
								>
									Go Back
								</Button>
								<Button
									size="xs"
									leftSection={<IconTrash size={18} />}
									color="red"
									onClick={open}
								>
									Delete Deposit
								</Button>
							</Group>
						</SimpleGrid>

						<form
							className="flex flex-col gap-y-6 mt-3"
							id="form-add-record"
							onSubmit={depositForm.onSubmit((values) =>
								submitEditDeposit(values)
							)}
						>
							<DateInput
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
								Save Deposit
							</Button>
						</form>
					</Flex>
				</Container>
				<Modal opened={opened} onClose={close} title="Delete Deposit?">
					<Text>Are you sure you want to delete this deposit?</Text>
					<Group grow className="mt-4">
						<Button color="red" onClick={deleteDeposit}>
							Delete
						</Button>
						<Button color="gray" onClick={close}>
							Cancel
						</Button>
					</Group>
				</Modal>
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
		const [deposit_res]: [Supabase_Response<Deposit>] = await Promise.all([
			supabase.from("deposits").select("*").eq("id", id),
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
