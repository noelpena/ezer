import Layout from "@/components/Layout";
import { Member, Supabase_Response } from "@/types/models";
import { createSupabaseReqResClient } from "@/utils/supabase";
import {
	Anchor,
	Breadcrumbs,
	Button,
	Container,
	Flex,
	Select,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Session } from "@supabase/supabase-js";
import _ from "lodash";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { z } from "zod";

type EditDepositProps = {
	session: Session;
	member_data: Member[];
};

export default function EditMember({ session, member_data }: EditDepositProps) {
	const [btnIsDisabled, setBtnIsDisabled] = useState<boolean>(false);
	const [memberData, setDepositData] = useState<Member>(member_data[0]);

	const editMemberSchema = z.object({
		full_name: z.string().optional(),
		display_name: z.string().optional(),
		is_active: z.boolean().or(z.enum(["true", "false"])),
		created_at: z.date(),
	});

	const memberForm = useForm({
		validate: zodResolver(editMemberSchema),
		initialValues: {
			full_name: memberData.full_name,
			display_name: memberData.display_name,
			is_active: memberData.is_active.toString(),
			created_at: memberData.created_at,
		},
	});

	const submitEditMember = async (values: any) => {
		setBtnIsDisabled(true);
		var newData = _.cloneDeep(values);

		console.log(newData);

		// const newDepositResponse = await fetch("/api/deposit/", {
		// 	method: "PUT",
		// 	body: JSON.stringify(newData),
		// });

		// const { data, error } = await newDepositResponse.json();
		// // console.log(data);
		// if (error) {
		// 	console.error(error);
		// }
		// // handle error, add logging

		// setDepositData(data[0]);
		memberForm.reset();

		setBtnIsDisabled(false);
	};

	const items: any = [
		{ title: "Member", href: "/view/members" },
		{ title: "Edit Member", href: "##" },
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
				<title>Ezer | Edit Member</title>
			</Head>
			<Layout session={session}>
				{/* {JSON.stringify(member_data)} */}
				<Container>
					<Breadcrumbs separator=">" mt="xs">
						{breadCrumbItems}
					</Breadcrumbs>
					<Flex className="mt-8" direction="column">
						<Title order={2}>Edit Member</Title>

						<form
							className="flex flex-col gap-y-6 mt-3"
							id="form-add-record"
							onSubmit={memberForm.onSubmit((values) =>
								submitEditMember(values)
							)}
						>
							<TextInput
								label="Full name"
								{...memberForm.getInputProps("full_name")}
								size="lg"
							/>

							<TextInput
								label="Display name"
								{...memberForm.getInputProps("display_name")}
								size="lg"
							/>

							<Select
								label="Active?"
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
								{...memberForm.getInputProps("is_active")}
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
		const [member_res]: [Supabase_Response<Member>] = await Promise.all([
			supabase.from("members").select("*").eq("id", id),
		]);

		const { data: member_data, error: deposit_error } = member_res;

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
