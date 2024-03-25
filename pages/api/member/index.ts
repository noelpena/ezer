import type { NextApiRequest, NextApiResponse } from "next";
import { Member } from "@/types/models";
import { PostgrestError } from "@supabase/supabase-js";
import { deleteResource, editResource, newResource } from "../resource";

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
		return newResource<Member>(req, res, "members");
	} else if (req.method === "PUT") {
		return editResource<Member>(req, res, "members");
	} else if (req.method === "DELETE") {
		return deleteResource(req, res, "members");
	} else {
		return res
			.status(405)
			.json({ data: {}, error: null, message: "Method not allowed" });
	}
}
