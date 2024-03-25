import type { NextApiRequest, NextApiResponse } from "next";
import { Deposit } from "@/types/models";
import { PostgrestError } from "@supabase/supabase-js";
import { editResource, newResource, deleteResource } from "../resource";

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
		return newResource<Deposit>(req, res, "deposits");
	} else if (req.method === "PUT") {
		return editResource<Deposit>(req, res, "deposits");
	} else if (req.method === "DELETE") {
		return deleteResource(req, res, "deposits");
	} else {
		return res
			.status(405)
			.json({ data: {}, error: null, message: "Method not allowed" });
	}
}
