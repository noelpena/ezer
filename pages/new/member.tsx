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
	Select,
	SimpleGrid,
	TextInput,
	Title,
} from "@mantine/core";
import { createSupabaseReqResClient } from "@/utils/supabase";

import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";

import type { GetServerSidePropsContext } from "next/types";
import type { Member, Supabase_Response } from "@/types/models";

import Layout from "@/components/Layout";

import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import _ from "lodash";
import { showToast, updateToast } from "@/utils/notification";
import { IconArrowLeft } from "@tabler/icons-react";

type NewMemberProps = {
	deposit_data: Member[];
	session: Session;
};

export default function NewMember({ session, deposit_data }: NewMemberProps) {
	const [btnIsDisabled, setBtnIsDisabled] = useState<boolean>(false);
	const router = useRouter();

	const newMemberSchema = z.object({
		full_name: z.string().optional(),
		display_name: z.string().optional(),
		is_active: z.boolean().or(z.enum(["true", "false"])),
	});

	const memberForm = useForm({
		validate: zodResolver(newMemberSchema),
		initialValues: {
			full_name: "",
			display_name: "",
			is_active: "true",
		},
	});

	const submitNewMember = async (values: any) => {
		setBtnIsDisabled(true);

		showToast(
			"new-member",
			"Loading...",
			"Adding new member.",
			"blue",
			true
		);

		var newData = _.cloneDeep(values);
		console.log(newData);

		const newMemberResponse = await fetch("/api/member", {
			method: "POST",
			body: JSON.stringify(newData),
		});

		const { data, error } = await newMemberResponse.json();

		if (error) {
			console.error(error);
		}

		memberForm.reset();
		updateToast("new-member", "Success!", "New member added.", "green");
		setBtnIsDisabled(false);
	};

	const items: any = [
		{ title: "Members", href: "/view/members" },
		{ title: "Add New Member", href: "##" },
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
				<title>Ezer | New Member</title>
			</Head>
			<Layout session={session}>
				<div className="h-screen max-w-screen-lg mt-6 mb-12 mx-4">
					<Breadcrumbs separator=">" mt="xs">
						{breadCrumbItems}
					</Breadcrumbs>
					<Flex className="mt-8" direction="column">
						<SimpleGrid cols={{ base: 1, sm: 2 }}>
							<Title order={2}>Add New Member</Title>
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
							onSubmit={memberForm.onSubmit((values) =>
								submitNewMember(values)
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
								Add New Member
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
		const [member_res]: [Supabase_Response<Member>] = await Promise.all([
			supabase.from("members").select("*").eq("is_active", false),
		]);

		const { data: member_data, error: member_error } = member_res;

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
