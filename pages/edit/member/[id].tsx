import Layout from "@/components/Layout";
import { Member, Supabase_Response } from "@/types/models";
import { createSupabaseReqResClient } from "@/utils/supabase";
import {
	Modal,
	Anchor,
	Breadcrumbs,
	Button,
	Container,
	Flex,
	Select,
	TextInput,
	Title,
	Group,
	Text,
	SimpleGrid,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { Session } from "@supabase/supabase-js";
import _ from "lodash";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { z } from "zod";
import { showToast, updateToast } from "@/utils/notification";
import { useRouter } from "next/router";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";

type EditMemberProps = {
	session: Session;
	member_data: Member[];
};

export default function EditMember({ session, member_data }: EditMemberProps) {
	const [btnIsDisabled, setBtnIsDisabled] = useState<boolean>(false);
	const [memberData, setMemberData] = useState<Member>(member_data[0]);
	const [opened, { open, close }] = useDisclosure(false);
	const router = useRouter();

	const editMemberSchema = z.object({
		id: z.string().uuid(),
		full_name: z.string().optional(),
		display_name: z.string().optional(),
		is_active: z.boolean().or(z.enum(["true", "false"])),
		created_at: z
			.date({
				required_error: "Please select a date and time",
				invalid_type_error: "That's not a date!",
			})
			.nullable()
			.or(z.string().nullable()),
	});

	const memberForm = useForm({
		validate: zodResolver(editMemberSchema),
		initialValues: {
			id: memberData.id,
			full_name: memberData.full_name,
			display_name: memberData.display_name,
			is_active: memberData.is_active.toString(),
			created_at: memberData.created_at,
		},
	});

	const submitEditMember = async (values: any) => {
		setBtnIsDisabled(true);
		showToast("edit-member", "Loading...", "Editing member.", "blue", true);
		var newData = _.cloneDeep(values);

		console.log(newData);

		const editMemberResponse = await fetch("/api/member/", {
			method: "PUT",
			body: JSON.stringify(newData),
		});

		const { data, error } = await editMemberResponse.json();
		console.log(data);
		if (error) {
			console.error(error);
		}
		// handle error, add logging

		setMemberData(data[0]);
		updateToast("edit-member", "Success!", "Member was updated.", "green");
		setBtnIsDisabled(false);
	};

	const deleteMember = async () => {
		showToast(
			"delete-member",
			"Loading...",
			"Deleting member.",
			"blue",
			true
		);
		const deleteMemberResponse = await fetch("/api/member/", {
			method: "DELETE",
			body: JSON.stringify({ id: memberData.id }),
		});
		if (deleteMemberResponse.status === 204) {
			updateToast(
				"delete-member",
				"Success!",
				"Member was deleted.",
				"green"
			);

			router.push("/view/members");
		} else {
			updateToast(
				"delete-member",
				"Failed.",
				"Member was not deleted. " + deleteMemberResponse.statusText,
				"red"
			);
		}
	};

	const items: any = [
		{ title: "Members", href: "/view/members" },
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
						<SimpleGrid className="mb-4" cols={{ base: 1, xs: 2 }}>
							<Title order={2}>Edit Member</Title>

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
									Delete Member
								</Button>
							</Group>
						</SimpleGrid>

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
								Save Member
							</Button>
						</form>
					</Flex>
				</Container>
				<Modal opened={opened} onClose={close} title="Delete Member?">
					<Text>Are you sure you want to delete this member?</Text>
					<Group grow className="mt-4">
						<Button color="red" onClick={deleteMember}>
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
		const [member_res]: [Supabase_Response<Member>] = await Promise.all([
			supabase.from("members").select("*").eq("id", id),
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
