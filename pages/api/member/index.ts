import type { NextApiRequest, NextApiResponse } from "next";
import { Member } from "@/types/models";
import { PostgrestError } from "@supabase/supabase-js";
import { editResource, newResource } from "../resource";

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
		// return createNewMember(req, res);
	} else if (req.method === "PUT") {
		// return editMember(req, res);
		return editResource<Member>(req, res, "members");
	} else {
		return res
			.status(405)
			.json({ data: {}, error: null, message: "Method not allowed" });
	}
}
