// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { createApiRouteClient } from "@/utils/supabase";
import { Supabase_Response, Record, GoogleSheetView } from "@/types/models";
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
		return createNewRecord(req, res);
	} else {
		return res
			.status(405)
			.json({ data: {}, error: null, message: "Method not allowed" });
	}
}

async function createNewRecord(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const supabase = createApiRouteClient(req, res);
	const body = JSON.parse(req.body);
	body.id = uuidv4();

	const newRecordResponse: Supabase_Response<Record> = await supabase
		.from("records")
		.insert([body])
		.select();

	if (newRecordResponse.data) {
		const googleSheetRecord: Supabase_Response<GoogleSheetView> =
			await supabase
				.from("googlesheetview")
				.select("*")
				.eq("id", newRecordResponse.data[0].id);

		res.status(200).json({
			data: googleSheetRecord.data,
			error: null,
			message: "",
		});
	} else {
		res.status(500).json({
			data: null,
			error: newRecordResponse.error,
			message: newRecordResponse.error.message,
		});
	}
}
