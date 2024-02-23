// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { createApiRouteClient } from "@/utils/supabase";
import { Supabase_Response, Record } from "@/types/models";
import { PostgrestError } from "@supabase/supabase-js";

type Data = {
	data: object | null;
	error: PostgrestError | null;
	message: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === "POST") {
		return createNewDeposit(req, res);
	} else {
		return res
			.status(405)
			.json({ data: {}, error: null, message: "Method not allowed" });
	}
}

async function createNewDeposit(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const supabase = createApiRouteClient(req, res);

	let body = req.body;
	if (typeof req.body === "string") {
		body = JSON.parse(req.body);
	}
	body.id = uuidv4();

	const newDepositResponse: Supabase_Response<Record> = await supabase
		.from("deposits")
		.insert([body])
		.select("*");

	if (newDepositResponse.data) {
		res.status(200).json({
			data: newDepositResponse.data,
			error: null,
			message: "",
		});
	} else {
		res.status(500).json({
			data: null,
			error: newDepositResponse.error,
			message: newDepositResponse.error.message,
		});
	}
}
