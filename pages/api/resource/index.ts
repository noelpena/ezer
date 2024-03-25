import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { createApiRouteClient } from "@/utils/supabase";
import { Supabase_Response } from "@/types/models";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

type Data = {
	data: object | null;
	error: PostgrestError | null;
	message: string;
};

export async function newResource<T>(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	tableName: string
) {
	const supabase = createApiRouteClient(req, res);

	let body = req.body;
	if (typeof req.body === "string") {
		body = JSON.parse(req.body);
	}
	body.id = uuidv4();

	const newResponse: Supabase_Response<T> = await supabase
		.from(tableName)
		.insert([body])
		.select("*");

	if (newResponse.data) {
		return res.status(200).json({
			data: newResponse.data,
			error: null,
			message: "",
		});
	} else {
		return res.status(500).json({
			data: null,
			error: newResponse.error,
			message: newResponse.error.message,
		});
	}
}

export async function editResource<T>(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	tableName: string
) {
	const supabase = createApiRouteClient(req, res);

	let body = req.body;
	if (typeof req.body === "string") {
		body = JSON.parse(req.body);
	}

	const editResponse: Supabase_Response<T> = await supabase
		.from(tableName)
		.update(body)
		.eq("id", body.id)
		.select("*");

	if (editResponse.data) {
		return res.status(200).json({
			data: editResponse.data,
			error: null,
			message: "",
		});
	} else {
		return res.status(500).json({
			data: null,
			error: editResponse.error,
			message: editResponse.error.message,
		});
	}
}

export async function deleteResource(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	tableName: string
) {
	const supabase = createApiRouteClient(req, res);

	let body = req.body;
	if (typeof req.body === "string") {
		body = JSON.parse(req.body);
	}

	const deleteResponse: PostgrestSingleResponse<null> = await supabase
		.from(tableName)
		.delete()
		.eq("id", body.id);

	if (deleteResponse.status === 204) {
		return res.status(204).json({
			data: deleteResponse.data,
			error: null,
			message: "",
		});
	} else {
		return res.status(500).json({
			data: null,
			error: deleteResponse.error,
			message: "",
		});
	}
}
